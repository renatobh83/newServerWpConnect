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

// Cria as filas
export const queues = Object.values(jobs).map((job: any) => {
	const bullQueue = new Queue(job.key, { connection: redisConfig });

	// Adiciona os listeners
	bullQueue.on("waiting", QueueListener.onWaiting);
	bullQueue.on("removed", QueueListener.onRemoved);

	return {
		bull: bullQueue,
		name: job.key,
		handle: job.handle,
		options: job.options,
	};
});

// Função para adicionar jobs a uma fila específica
export async function addJob(
	queueName: string,
	data: Record<string, any>,
	options?: Record<string, any>,
) {
	const queue = queues.find((q) => q.name === queueName);

	if (!queue) {
		throw new Error(`Queue "${queueName}" not found.`);
	}

	try {
		await queue.bull.add(queueName, data, { ...queue.options, ...options });
		logger.info(`Job adicionado à fila ${queueName}`);
	} catch (error) {
		logger.error({
			message: `Erro ao adicionar job à fila ${queueName}`,
			error,
		});
		throw error;
	}
}

// Função para configurar o processamento
export function processQueues(concurrency = 60) {
	// biome-ignore lint/complexity/noForEach: <explanation>
	queues.forEach(({ name, handle }) => {
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
				connection: redisConfig,
				concurrency,
			},
		);
	});
	logger.info("Workers configurados e prontos para processar jobs.");
}
