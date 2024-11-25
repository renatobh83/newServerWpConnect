import { Queue, Worker, QueueEvents, JobsOptions } from "bullmq";
import * as jobs from "../jobs/Index";
import QueueListeners from "./QueueListeners";

// Redis connection options
const redisConfig = {
  host: process.env.IO_REDIS_SERVER,
  port: +(process.env.IO_REDIS_PORT || "6379"),
  password: process.env.IO_REDIS_PASSWORD || undefined,
  db: 3,
  maxRetriesPerRequest: null,
};

// Define queues based on jobs
const queues = Object.values(jobs).map((job: any) => {
  const queue = new Queue(job.key, {
    connection: redisConfig,
    defaultJobOptions: job.options as JobsOptions,
  });

  const queueEvents = new QueueEvents(job.key, { connection: redisConfig });

  queueEvents.on("completed", QueueListeners.onCompleted);
  queueEvents.on("failed", QueueListeners.onFailed);
  queueEvents.on("stalled", QueueListeners.onStalled);
  queueEvents.on("waiting", QueueListeners.onWaiting);
  queueEvents.on("active", QueueListeners.onActive);
  queueEvents.on("error", QueueListeners.onError);
  queueEvents.on("removed", QueueListeners.onRemoved);
  queueEvents.on("cleaned", QueueListeners.onClean);

  return {
    queue,
    name: job.key,
    handle: job.handle,
    options: job.options,
  };
});

export default {
  queues,

  // Add a job or multiple jobs to a queue
  async add(name: string, data: any | any[]) {
    const queueData = this.queues.find((q: any) => q.name === name);
    if (!queueData) {
      throw new Error(`Queue ${name} does not exist`);
    }

    if (Array.isArray(data)) {
      const bulkData = data.map((jobData: any) => ({
        name: jobData.name || `job-${Date.now()}`, // Optionally set a job name
        data: jobData,
        opts: { ...queueData.options, ...jobData?.options },
      }));
      return queueData.queue.addBulk(bulkData);
    }
    return queueData.queue.add(data.name || `job-${Date.now()}`, data, {
      ...queueData.options,
      ...data.options,
    });
  },

  // Process jobs in the queue
  process(concurrency = 100) {
    return this.queues.forEach((queueData) => {
      new Worker(
        queueData.name,
        async (job) => queueData.handle(job),
        {
          connection: redisConfig,
          concurrency,
        }
      ).on("error", QueueListeners.onError);
    });
  },
};