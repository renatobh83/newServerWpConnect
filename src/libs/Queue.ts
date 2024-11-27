import { type Job, Queue, Worker } from "bullmq";
import * as jobs from "../jobs/Index";
import { logger } from "../utils/logger";
import QueueListener from "./QueueListeners"; // Classe de listeners

// Redis connection options
const redisConfig = {
	host: process.env.IO_REDIS_SERVER,
	port: +(process.env.IO_REDIS_PORT || "6379"),
	password: process.env.IO_REDIS_PASSWORD || undefined,
	db: 3,
	maxRetriesPerRequest: null,
};

export const queues = Object.values(jobs).map((job: any) => {
	const bullQueue = new Queue(job.key, { connection: redisConfig });
	// Adicionando os listeners
	bullQueue.on("waiting", QueueListener.onWaiting);
	//  bullQueue.on("active", (job) => QueueListener.onActive(job, Promise.resolve(job)));
	//  bullQueue.on("stalled", QueueListener.onStalled);
	//  bullQueue.on("completed", QueueListener.onCompleted);
	//  bullQueue.on("failed", QueueListener.onFailed);
	// bullQueue.on("cleaned", QueueListener.onClean);
	bullQueue.on("removed", QueueListener.onRemoved);

	// Adiciona o job na fila com suas opções
	async function addJobToQueue() {
		try {
			await bullQueue.add(job.key, {}, job.options);
			logger.info(`Job ${job.key} adicionado à fila.`);
		} catch (error) {
			logger.error({ message: `Erro ao adicionar o job ${job.key}`, error });
		}
	}

	// Adiciona o job ao iniciar a fila
	addJobToQueue();
	return {
		bull: bullQueue,
		name: job.key,
		handle: job.handle,
		options: job.options,
	};
});

// Configura o processamento de jobs
// biome-ignore lint/complexity/noForEach: <explanation>
queues.forEach(({ bull, name, handle }) => {
	new Worker(
		name,
		async (job: Job) => {
			try {
				logger.info(`Processando job ${name}`);
				await handle(job.data); // Passa os dados do job para o handle
				logger.info(`Job ${name} processado com sucesso.`);
			} catch (error) {
				logger.error({ message: `Erro ao processar o job ${name}`, error });
			}
		},
		{
			connection: {
				host: process.env.IO_REDIS_SERVER,
				port: +(process.env.IO_REDIS_PORT || "6379"),
				password: process.env.IO_REDIS_PASSWORD || undefined,
				db: 3,
			},
		},
	);
});
