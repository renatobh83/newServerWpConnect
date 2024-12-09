import "../app/config-env";
import { type Job, Queue, Worker } from "bullmq";
import * as jobs from "../jobs/Index";
import { logger } from "../utils/logger";
import QueueListener from "./QueueListeners"; // Classe de listeners
import { Redis } from "ioredis";
// Redis connection options

const redis = new Redis({
	host: process.env.IO_REDIS_SERVER,
	port: +(process.env.IO_REDIS_PORT || "6379"),
	password: process.env.IO_REDIS_PASSWORD || undefined,
	maxRetriesPerRequest: null,
	retryStrategy: (times: number) => Math.min(times * 50, 2000),
});
// Monitoramento de eventos
redis.on("connect", () => {
	logger.info("Redis conectado com sucesso.");
});
redis.on("error", (err) => {
	logger.error("Erro ao conectar ao Redis:", err);
});
redis.on("end", () => {
	logger.warn("Conexão com Redis encerrada.");
});

// Cria as filas
export const queues = Object.values(jobs).map((job: any) => {
	const bullQueue = new Queue(job.key, { connection: redis });

	// Adiciona os listeners

	bullQueue.on("waiting", QueueListener.onWaiting);
	bullQueue.on("removed", QueueListener.onRemoved);
	bullQueue.on("error", QueueListener.onError);
	bullQueue.on("progress", QueueListener.onProgress);
	bullQueue.on("ioredis:close", QueueListener.onIoredis);

	return {
		bull: bullQueue,
		name: job.key,
		handle: job.handle,
		options: job.options,
	};
});

// Função para adicionar jobs a uma fila específica
export async function addJob(queueName: string, data: Record<string, any>) {
	const queue = queues.find((q) => q.name === queueName);

	if (!queue) {
		throw new Error(`Queue "${queueName}" not found.`);
	}

	try {
		await queue.bull.add(queueName, data, {
			...queue.options, // Opções padrão da fila
			...data.options, // Opções específicas do job
		});
		logger.info(`Job adicionado à fila ${queueName}`);
	} catch (error) {
		logger.error({
			message: `Erro ao adicionar job à fila ${queueName}`,
			error,
		});
		throw error;
	}
}
const workers: Worker[] = [];
// Função para configurar o processamento
export function processQueues(concurrency = 60) {
	// biome-ignore lint/complexity/noForEach: <explanation>
	queues.forEach(({ name, handle }) => {
		const worker = new Worker(
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
				connection: redis,
				concurrency,
			},
		);
		worker.on("stalled", (job: any) => {
			logger.warn(`Job em espera detectado: ${job.id}`);
		});

		worker.on("completed", (job) => {
			logger.info(`Job ${job.id} na fila ${name} concluído com sucesso.`);
		});

		worker.on("failed", (job, error) => {
			logger.error(
				`Job ${job?.id || "unknown"} na fila ${name} falhou: ${error.message}`,
			);
		});
		workers.push(worker);
	});
	logger.info("Workers configurados e prontos para processar jobs.");
}

export async function closeWorkers() {
	for (const worker of workers) {
		try {
			await worker.close();
			logger.info(`Worker para a fila ${worker.name} foi fechado.`);
		} catch (error) {
			logger.error(
				`Erro ao fechar o worker para a fila ${worker.name}: ${error.message}`,
			);
		}
	}
}

export async function closeQueues() {
	for (const { bull, name } of queues) {
		try {
			await bull.close();
			logger.info(`Fila ${name} foi fechada.`);
		} catch (error) {
			logger.error(`Erro ao fechar a fila ${name}: ${error.message}`);
		}
	}
}
// Close queue by name
export async function getJobByName(queueName: string): Promise<void> {
	try {
		// Encontra a fila correspondente pelo nome
		const queue = queues.find((q) => q.name === queueName);

		if (!queue) {
			throw new Error(`Queue "${queueName}" not found.`);
		}
		await queue.bull.close;
		logger.info(`Fila ${queueName} foi fechada.`);
	} catch (error) {
		logger.error({
			message: `Erro ao buscar job  na fila ${queueName}`,
			error,
		});
	}
}
