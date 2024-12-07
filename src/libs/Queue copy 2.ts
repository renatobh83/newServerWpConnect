// import Queue from "bull";
// import QueueListeners from "./QueueListeners";
// import * as jobs from "../jobs/Index";
// import { logger } from "../utils/logger";
// // import { type Job, Queue, Worker } from "bullmq";
// import { Redis } from "ioredis";

// const redis = new Redis({
// 	host: process.env.IO_REDIS_SERVER,
// 	port: +(process.env.IO_REDIS_PORT || "6379"),
// 	password: process.env.IO_REDIS_PASSWORD || undefined,
// 	maxRetriesPerRequest: null,
// 	retryStrategy: (times: number) => Math.min(times * 50, 2000), // Atraso progressivo
// });

// // Monitoramento de eventos
// redis.on("connect", () => {
// 	logger.info("Redis conectado com sucesso.");
// });
// redis.on("error", (err) => {
// 	logger.error("Erro ao conectar ao Redis:", err);
// });
// redis.on("end", () => {
// 	logger.warn("Conexão com Redis encerrada.");
// });

// // Configuração das filas
// const queues = Object.values(jobs).map((job: any) => ({
// 	bull: new Queue(job.key, {
// 		redis: {
// 			host: process.env.IO_REDIS_SERVER,
// 			port: +(process.env.IO_REDIS_PORT || "6379"),
// 			password: process.env.IO_REDIS_PASSWORD || undefined,
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
// 		return queue.bull.add(data, { ...queue.options, ...data.options });
// 	},
// 	process() {
// 		return this.queues.forEach((queue) => {
// 			queue.bull.process(10, queue.handle);
// 			queue.bull.on("paused", () => {
// 				logger.warn(`Queue ${queue.name} foi pausada.`);
// 			});
// 			queue.bull.on("resumed", () => {
// 				logger.info(`Queue ${queue.name} foi retomada.`);
// 			});
// 			queue.bull.on("delayed", (jobId) => {
// 				logger.info(
// 					`Job ${jobId} foi adicionado como atrasado na fila ${queue.name}.`,
// 				);
// 			});
// 			queue.bull
// 				.on("active", QueueListeners.onActive)
// 				.on("error", QueueListeners.onError)
// 				.on("waiting", QueueListeners.onWaiting)
// 				.on("completed", QueueListeners.onCompleted)
// 				.on("stalled", QueueListeners.onStalled)
// 				.on("failed", QueueListeners.onFailed)
// 				.on("cleaned", QueueListeners.onClean)
// 				.on("removed", QueueListeners.onRemoved);
// 		});
// 	},
// };
