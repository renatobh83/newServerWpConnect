import { Queue, Worker, type Job, type JobsOptions } from "bullmq";
import QueueListeners from "./QueueListeners";
import * as jobs from "../jobs/Index";

const redisConfig = {
	host: process.env.IO_REDIS_SERVER,
	port: +(process.env.IO_REDIS_PORT || "6379"),
	password: process.env.IO_REDIS_PASSWORD || undefined,
	db: 3,
	maxRetriesPerRequest: null,
};

const queues = Object.values(jobs).map((job: any) => ({
	queue: new Queue(job.key, {
		connection: redisConfig,
		defaultJobOptions: job.options || {},
	}),
	name: job.key,
	handle: job.handle,
	options: job.options || {},
}));

export default {
	queues,

	async add(name: string, data: any | any[], options?: JobsOptions) {
		const queueInfo = this.queues.find((q) => q.name === name);
		if (!queueInfo) {
			throw new Error(`Queue ${name} not exists`);
		}

		const { queue } = queueInfo;

		if (Array.isArray(data)) {
			const jobsToAdd = data.map((jobData) => ({
				name: jobData.name || `${name}-job`,
				data: jobData,
				opts: {
					...queueInfo.options,
					...jobData?.options,
					...options,
				},
			}));
			return queue.addBulk(jobsToAdd);
		}

		return queue.add(name, data, {
			...queueInfo.options,
			...data.options,
			...options,
		});
	},

	process(concurrency = 100) {
		// biome-ignore lint/complexity/noForEach: <explanation>
		this.queues.forEach(({ queue, name, handle }) => {
			const worker = new Worker(
				name,
				async (job: Job) => {
					try {
						await handle(job);
					} catch (error) {
						console.error(
							`Error processing job ${job.name} in queue ${name}:`,
							error,
						);
						throw error; // Permite o retry do job
					}
				},
				{
					connection: redisConfig,
					concurrency,
				},
			);

			// Configurar Listeners
			worker.on("active", QueueListeners.onActive);
			worker.on("completed", QueueListeners.onCompleted);
			worker.on("failed", QueueListeners.onFailed);
			worker.on("stalled", QueueListeners.onStalled);
			worker.on("error", QueueListeners.onError);
			worker.on("progress", QueueListeners.onWaiting);
		});
	},
};

// import { Queue, Worker, QueueScheduler, Job, JobsOptions } from "bullmq";
// import QueueListeners from "./QueueListeners";
// import * as jobs from "../jobs/Index";

// const redisConfig = {
// 	host: process.env.IO_REDIS_SERVER,
// 	port: +(process.env.IO_REDIS_PORT || "6379"),
// 	password: process.env.IO_REDIS_PASSWORD || undefined,
// 	db: 3,
// 	maxRetriesPerRequest: null,
// };

// const queues = Object.values(jobs).map((job: any) => {
// 	const queue = new Queue(job.key, {
// 		connection: redisConfig,
// 		defaultJobOptions: job.options || {},
// 	});

// 	// Adiciona o Scheduler
// 	new QueueScheduler(job.key, { connection: redisConfig });

// 	return {
// 		queue,
// 		name: job.key,
// 		handle: job.handle,
// 		options: job.options || {},
// 	};
// });

// export default {
// 	queues,

// 	async add(name: string, data: any | any[], options?: JobsOptions) {
// 		const queueInfo = this.queues.find((q) => q.name === name);
// 		if (!queueInfo) {
// 			throw new Error(`Queue ${name} not exists`);
// 		}

// 		const { queue } = queueInfo;

// 		if (Array.isArray(data)) {
// 			const jobsToAdd = data.map((jobData) => ({
// 				name: jobData.name || `${name}-job`,
// 				data: jobData,
// 				opts: {
// 					...queueInfo.options,
// 					...jobData?.options,
// 					...options,
// 				},
// 			}));
// 			return queue.addBulk(jobsToAdd);
// 		}

// 		return queue.add(name, data, {
// 			...queueInfo.options,
// 			...data.options,
// 			...options,
// 		});
// 	},

// 	process(concurrency = 100) {
// 		this.queues.forEach(({ queue, name, handle }) => {
// 			const worker = new Worker(
// 				name,
// 				async (job: Job) => {
// 					try {
// 						await handle(job);
// 					} catch (error) {
// 						console.error(
// 							`Error processing job ${job.name} in queue ${name}:`,
// 							error,
// 						);
// 						throw error; // Permite o retry do job
// 					}
// 				},
// 				{
// 					connection: redisConfig,
// 					concurrency,
// 				},
// 			);

// 			// Configurar Listeners
// 			worker.on("active", QueueListeners.onActive);
// 			worker.on("completed", QueueListeners.onCompleted);
// 			worker.on("failed", QueueListeners.onFailed);
// 			worker.on("stalled", QueueListeners.onStalled);
// 			worker.on("error", QueueListeners.onError);
// 			worker.on("progress", QueueListeners.onWaiting);
// 		});
// 	},
// };
// import { Queue } from "bullmq";
// import QueueListeners from "./QueueListeners";
// import * as jobs from "../jobs/Index";
// import { logger } from "../utils/logger";

// const redisConfig = {
// 	host: process.env.IO_REDIS_SERVER,
// 	port: +(process.env.IO_REDIS_PORT || "6379"),
// 	password: process.env.IO_REDIS_PASSWORD || undefined,
// 	db: 3,
// 	maxRetriesPerRequest: null,
// };
// // biome-ignore lint/suspicious/noExplicitAny: <explanation>
// const queues = Object.values(jobs).map((job: any) => ({
// 	bull: new Queue(job.key, {
// 		redis: {
// 			host: process.env.IO_REDIS_SERVER,
// 			port: +(process.env.IO_REDIS_PORT || "6379"),
// 			password: process.env.IO_REDIS_PASSWORD || undefined,
// 			db: 3,
// 			retryStrategy: (times) => {
// 				const delay = Math.min(times * 2000, 20000);
// 				logger.info(
// 					`Tentando reconectar ao Redis após ${delay}ms (tentativa ${times})  `,
// 				);
// 				return delay;
// 			},
// 		},
// 	}),
// 	name: job.key,
// 	handle: job.handle,
// 	options: job.options,
// }));

// export default {
// 	queues,
// 	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// 	async add(name: string, data: any | any[]) {
// 		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// 		const queue = this.queues.find((q: any) => q.name === name);
// 		if (!queue) {
// 			throw new Error(`Queue ${name} not exists`);
// 		}
// 		if (Array.isArray(data)) {
// 			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
// 		return queue.bull.add(data, { ...queue.options, ...data.options });
// 	},
// 	process(concurrency = 100) {
// 		// biome-ignore lint/complexity/noForEach: <explanation>
// 		return this.queues.forEach((queue) => {
// 			queue.bull.process(concurrency, queue.handle);

// 			queue.bull
// 				.on("active", QueueListeners.onActive)
// 				.on("error", QueueListeners.onError)
// 				.on("waiting", QueueListeners.onWaiting)
// 				.on("completed", QueueListeners.onCompleted)
// 				.on("stalled", QueueListeners.onStalled)
// 				.on("failed", QueueListeners.onFailed)
// 				.on("cleaned", QueueListeners.onClean)
// 				.on("removed", QueueListeners.onRemoved)
// 				.on("log", QueueListeners.log);
// 		});
// 	},
// };

// import { Queue, Worker, QueueScheduler, type Job, type JobsOptions } from "bullmq";
// import QueueListeners from "./QueueListeners";
// import * as jobs from "../jobs/Index";

// const redisConfig = {
// 	host: process.env.IO_REDIS_SERVER,
// 	port: +(process.env.IO_REDIS_PORT || "6379"),
// 	password: process.env.IO_REDIS_PASSWORD || undefined,
// 	db: 3,
// 	maxRetriesPerRequest: null,
// };

// const queues = Object.values(jobs).map((job: any) => {
// 	const queue = new Queue(job.key, {
// 		connection: redisConfig,
// 		defaultJobOptions: job.options || {},
// 	});

// 	// Adicionar um QueueScheduler para lidar com jobs travados
// 	new QueueScheduler(job.key, { connection: redisConfig });

// 	return {
// 		queue,
// 		name: job.key,
// 		handle: job.handle,
// 		options: job.options || {},
// 	};
// });

// export default {
// 	queues,

// 	async add(name: string, data: any | any[], options?: JobsOptions) {
// 		const queueInfo = this.queues.find((q) => q.name === name);
// 		if (!queueInfo) {
// 			throw new Error(`Queue ${name} not exists`);
// 		}

// 		const { queue } = queueInfo;

// 		if (Array.isArray(data)) {
// 			const jobsToAdd = data.map((jobData) => ({
// 				name: jobData.name || `${name}-job`,
// 				data: jobData,
// 				opts: {
// 					...queueInfo.options,
// 					...jobData?.options,
// 					...options,
// 				},
// 			}));
// 			return queue.addBulk(jobsToAdd);
// 		}

// 		return queue.add(name, data, {
// 			...queueInfo.options,
// 			...data.options,
// 			...options,
// 		});
// 	},

// 	process(concurrency = 100) {
// 		// biome-ignore lint/complexity/noForEach: <explanation>
// 		this.queues.forEach(({ queue, name, handle }) => {
// 			const worker = new Worker(
// 				name,
// 				async (job: Job) => {
// 					try {
// 						await handle(job);
// 					} catch (error) {
// 						console.error(
// 							`Error processing job ${job.name} in queue ${name}:`,
// 							error,
// 						);
// 						throw error; // Permite o retry do job
// 					}
// 				},
// 				{
// 					connection: redisConfig,
// 					concurrency,
// 				},
// 			);

// 			// Configurar Listeners
// 			worker.on("active", QueueListeners.onActive);
// 			worker.on("completed", QueueListeners.onCompleted);
// 			worker.on("failed", QueueListeners.onFailed);
// 			worker.on("stalled", QueueListeners.onStalled);
// 			worker.on("error", QueueListeners.onError);
// 			worker.on("progress", QueueListeners.onWaiting);
// 		});
// 	},
// };

// import { Queue, Worker } from "bullmq";
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
// 	handle: job.handle, // Função de processamento do job
// 	options: job.options, // Configurações do job
// }));

// export default {
// 	queues,
// 	async add(name: string, data: any) {
// 		const queue = this.queues.find((q) => q.name === name);
// 		if (!queue) {
// 			throw new Error(`Queue ${name} does not exist`);
// 		}
// 		return queue.bull.add(name, data, { ...queue.options });
// 	},
// 	process(concurrency = 100) {
// 		// biome-ignore lint/complexity/noForEach: <explanation>
// 		this.queues.forEach((queue) => {
// 			// Cria um Worker para processar os jobs
// 			new Worker(
// 				queue.name,
// 				async (job) => {
// 					// Executa a função de processamento
// 					return queue.handle(job);
// 				},
// 				{
// 					connection: {
// 						host: process.env.IO_REDIS_SERVER,
// 						port: +(process.env.IO_REDIS_PORT || "6379"),
// 						password: process.env.IO_REDIS_PASSWORD || undefined,
// 						db: 3,
// 					},
// 					concurrency, // Define o número de jobs processados simultaneamente
// 				},
// 			);
// 		});
// 	},
// };

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
