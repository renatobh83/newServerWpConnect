import type { Job } from "bull";
import { logger } from "../utils/logger";
import { number } from "yup";

export enum ExecutionType {
	DELAY = "delay",
	REPEAT = "repeat",
}

export type ExecutionOption = {
	type: ExecutionType;
	value: string | number;
	// start date and end date only supported for ExecutionType.REPEAT
	startDate?: string;
	endDate?: string;
};

export type JobConfig = {
	executionOptions: ExecutionOption;
	retryOptions?: RetryOptions;
};

export type RetryOptions = {
	attempts: number;
	fallbackUrl?: string;
};

export type RabbitMQJob = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any;
	queue: string;
};

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class QueueListener {
	static logLevel: "DEBUG" | "INFO" | "ERROR" = "INFO"; // Configuração do nível de log

	static log(message: string, level: "DEBUG" | "INFO" | "ERROR" = "INFO") {
		if (
			QueueListener.logLevel === level ||
			QueueListener.logLevel === "DEBUG"
		) {
			logger.debug(`Messagem from QueueListener ${message}`);
		} else if (QueueListener.logLevel === "INFO") {
			logger.info(`Messagem from info ${message}`);
		} else {
			logger.error(`Error ${message}`);
		}
	}
	static onActive(job: Job<JobConfig>) {
		// QueueListener.log()
		QueueListener.log(`A ${job.id} has started.`, "INFO");
	}
	static onCompleted(job: Job<JobConfig>, result: string) {
		QueueListener.log(
			`${job.id} successfully completed with a ${result}`,
			"INFO",
		);
	}
	static onError(err: Error): void {
		QueueListener.log(`Job with ID ${err} is waiting`, "ERROR");
	}
	static onStalled(job: Job<JobConfig>) {
		QueueListener.log(`${job.id} has been marked as stalled.`, "INFO");
	}
	static onFailed(job: Job<JobConfig>, err: string) {
		QueueListener.log(`${job.id} failed with reason ${err}`, "ERROR");
	}
	static onClean(jobs: Job<JobConfig>, type: string) {
		QueueListener.log(
			`Old jobs have been cleaned from the queue. ${jobs} is an array of cleaned and ${type}`,
			"INFO",
		);
	}
	static onWaiting(jobId: string): void {
		QueueListener.log(`Job with ID ${jobId} is waiting`, "DEBUG");
	}

	static onProgress(job: any, progress: number | object): void {
		QueueListener.log(`Job with ID ${job.id} in progress ${progress}`, "DEBUG");
	}

	static onIoredis(): void {
		QueueListener.log("Conexao com o redis foi fechada", "INFO");
	}

	static onRemoved(job: Job<JobConfig>): void {
		QueueListener.log(`Job with ID ${job.id} removed`, "DEBUG");
	}
}
