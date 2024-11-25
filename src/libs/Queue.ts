import { Queue, Worker } from "bullmq";
import * as jobs from "../jobs/Index";

const queues = Object.values(jobs).map((job: any) => ({
	bull: new Queue(job.key, {
		connection: {
			host: process.env.IO_REDIS_SERVER,
			port: +(process.env.IO_REDIS_PORT || "6379"),
			password: process.env.IO_REDIS_PASSWORD || undefined,
			db: 3,
		},
	}),
	name: job.key,
	handle: job.handle, // Função de processamento do job
	options: job.options, // Configurações do job
}));

export default {
	queues,
	async add(name: string, data: any) {
		const queue = this.queues.find((q) => q.name === name);
		if (!queue) {
			throw new Error(`Queue ${name} does not exist`);
		}
		return queue.bull.add(name, data, { ...queue.options });
	},
	process(concurrency = 100) {
		// biome-ignore lint/complexity/noForEach: <explanation>
		this.queues.forEach((queue) => {
			// Cria um Worker para processar os jobs
			new Worker(
				queue.name,
				async (job) => {
					// Executa a função de processamento
					return queue.handle(job);
				},
				{
					connection: {
						host: process.env.IO_REDIS_SERVER,
						port: +(process.env.IO_REDIS_PORT || "6379"),
						password: process.env.IO_REDIS_PASSWORD || undefined,
						db: 3,
					},
					concurrency, // Define o número de jobs processados simultaneamente
				},
			);
		});
	},
};

// import { Queue } from "bullmq";
// import * as jobs from "../jobs/Index";

// const queues = Object.values(jobs).map((job: any) => ({
// 	bull: new Queue(job.key, {
// 		connection: {
// 			host: process.env.IO_REDIS_SERVER,
// 			port: +(process.env.IO_REDIS_PORT || "6379"),
// 			password: process.env.IO_REDIS_PASSWORD || undefined,
// 			db: 3,
// 		},
// 	}),
// 	name: job.key,
// 	handle: job.handle,
// 	options: job.options,
// }));

// export default {
// 	queues,
// 	async add(name: string, data: any | any[]) {
// 		const queue = this.queues.find((q: any) => q.name === name);
// 		if (!queue) {
// 			throw new Error(`Queue ${name} not exists`);
// 		}
// 		if (Array.isArray(data)) {
// 			const parsedJobs = data.map((jobData: any) => {
// 				return {
// 					data: jobData,
// 					opts: {
// 						...queue.options,
// 						...jobData?.options,
// 					},
// 				};
// 			});
// 			return queue.bull.addBulk(parsedJobs);
// 		}
// 		return queue.bull.add(name, data, { ...queue.options, ...data.options });
// 	},
// 	process(concurrency = 100) {
// 		// biome-ignore lint/complexity/noForEach: <explanation>
// 		return this.queues.forEach((queue) => {
// 			queue.bull.process(concurrency, queue.handle);
// 		});
// 	},
// };

// // import Queue from "bull";
// // import * as jobs from "../jobs/Index";
// // import QueueListeners from "./QueueListeners";
// // // biome-ignore lint/suspicious/noExplicitAny: <explanation>
// // const queues = Object.values(jobs).map((job: any) => ({
// // 	bull: new Queue(job.key, {
// // 		redis: {
// // 			host: process.env.IO_REDIS_SERVER,
// // 			port: +(process.env.IO_REDIS_PORT || "6379"),
// // 			password: process.env.IO_REDIS_PASSWORD || undefined,
// // 			db: 3,
// // 			retryStrategy: (times) => {
// // 				const delay = Math.min(times * 2000, 20000);
// // 				return delay;
// // 			},
// // 		},
// // 	}),
// // 	name: job.key,
// // 	handle: job.handle,
// // 	options: job.options,
// // }));

// // export default {
// // 	queues,
// // 	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// // 	async add(name: string, data: any | any[]) {
// // 		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// // 		const queue = this.queues.find((q: any) => q.name === name);
// // 		if (!queue) {
// // 			throw new Error(`Queue ${name} not exists`);
// // 		}
// // 		if (Array.isArray(data)) {
// // 			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// // 			const parsedJobs = data.map((jobData: any) => {
// // 				return {
// // 					data: jobData,
// // 					opts: {
// // 						...queue.options,
// // 						...jobData?.options,
// // 					},
// // 				};
// // 			});
// // 			return queue.bull.addBulk(parsedJobs);
// // 		}
// // 		return queue.bull.add(data, { ...queue.options, ...data.options });
// // 	},
// // 	process(concurrency = 100) {
// // 		// biome-ignore lint/complexity/noForEach: <explanation>
// // 		return this.queues.forEach((queue) => {
// // 			queue.bull.process(concurrency, queue.handle);

// // 			queue.bull
// // 				.on("active", QueueListeners.onActive)
// // 				.on("error", QueueListeners.onError)
// // 				.on("waiting", QueueListeners.onWaiting)
// // 				.on("completed", QueueListeners.onCompleted)
// // 				.on("stalled", QueueListeners.onStalled)
// // 				.on("failed", QueueListeners.onFailed)
// // 				.on("cleaned", QueueListeners.onClean)
// // 				.on("removed", QueueListeners.onRemoved)
// // 				.on("log", QueueListeners.log);
// // 		});
// // 	},
// // };
