// import { Queue, Worker, QueueEvents, JobsOptions } from "bullmq";
// import * as jobs from "../jobs/Index";
// import QueueListeners from "./QueueListeners";

// // Redis connection options
// const redisConfig = {
//   host: process.env.IO_REDIS_SERVER,
//   port: +(process.env.IO_REDIS_PORT || "6379"),
//   password: process.env.IO_REDIS_PASSWORD || undefined,
//   db: 3,
//   maxRetriesPerRequest: null,
// };

// // Define queues based on jobs
// const queues = Object.values(jobs).map((job: any) => {
//   const queue = new Queue(job.key, {
//     connection: redisConfig,
//     defaultJobOptions: job.options as JobsOptions,
//   });

//   const queueEvents = new QueueEvents(job.key, { connection: redisConfig });

//   queueEvents.on("completed", QueueListeners.onCompleted);
//   queueEvents.on("failed", QueueListeners.onFailed);
//   queueEvents.on("stalled", QueueListeners.onStalled);
//   queueEvents.on("waiting", QueueListeners.onWaiting);
//   queueEvents.on("active", QueueListeners.onActive);
//   queueEvents.on("error", QueueListeners.onError);
//   queueEvents.on("removed", QueueListeners.onRemoved);
//   queueEvents.on("cleaned", QueueListeners.onClean);
// // 
//   return {
//     queue,
//     name: job.key,
//     handle: job.handle,
//     options: job.options,
//   };
// });

// export default {
//   queues,

//   // Add a job or multiple jobs to a queue
//   async add(name: string, data: any | any[]) {
//     const queueData = this.queues.find((q: any) => q.name === name);
//     if (!queueData) {
//       throw new Error(`Queue ${name} does not exist`);
//     }

//     if (Array.isArray(data)) {
//       const bulkData = data.map((jobData: any) => ({
//         name: jobData.name || `job-${Date.now()}`, // Optionally set a job name
//         data: jobData,
//         opts: { ...queueData.options, ...jobData?.options },
//       }));
//       return queueData.queue.addBulk(bulkData);
//     }
//     return queueData.queue.add(data.name || `job-${Date.now()}`, data, {
//       ...queueData.options,
//       ...data.options,
//     });
//   },

//   // Process jobs in the queue
//   process(concurrency = 100) {
//     return this.queues.forEach((queueData) => {
//       new Worker(
//         queueData.name,
//         async (job) => queueData.handle(job),
//         {
//           connection: redisConfig,
//           concurrency,
//         }
//       ).on("error", QueueListeners.onError);
//     });
//   },
// };
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Queue from "bull";
import QueueListeners from "./QueueListeners";
import * as jobs from "../jobs/Index";
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const queues = Object.values(jobs).map((job: any) => ({
  bull: new Queue(job.key, {
    redis: {
      host: process.env.IO_REDIS_SERVER,
      port: +(process.env.IO_REDIS_PORT || "6379"),
      password: process.env.IO_REDIS_PASSWORD || undefined,
      db: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 2000, 20000);
        console.log(
          `Tentando reconectar ao Redis após ${delay}ms (tentativa ${times})`
        );
        return delay;
      },
    },
  }),
  name: job.key,
  handle: job.handle,
  options: job.options,
}));

export default {
  queues,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async add(name: string, data: any | any[]) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const queue = this.queues.find((q: any) => q.name === name);
    if (!queue) {
      throw new Error(`Queue ${name} not exists`);
    }
    if (Array.isArray(data)) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const parsedJobs = data.map((jobData: any) => {
        return {
          data: jobData,
          opts: {
            ...queue.options,
            ...jobData?.options,
          },
        };
      });
      return queue.bull.addBulk(parsedJobs);
    }
    return queue.bull.add(data, { ...queue.options, ...data.options });
  },
  process(concurrency = 100) {
    // biome-ignore lint/complexity/noForEach: <explanation>
    return this.queues.forEach((queue) => {
      queue.bull.process(concurrency, queue.handle);

      queue.bull
        .on("active", QueueListeners.onActive)
        .on("error", QueueListeners.onError)
        .on("waiting", QueueListeners.onWaiting)
        .on("completed", QueueListeners.onCompleted)
        .on("stalled", QueueListeners.onStalled)
        .on("failed", QueueListeners.onFailed)
        .on("cleaned", QueueListeners.onClean)
        .on("removed", QueueListeners.onRemoved)
        .on("log", QueueListeners.log);
    });
  },
};