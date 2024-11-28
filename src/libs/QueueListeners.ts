import type { Job } from "bull";
import { logger } from "../utils/logger";

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

	static onError(err: Error): void {
		console.error(err);
	}
	static log(message: string, level: "DEBUG" | "INFO" | "ERROR" = "INFO") {
		if (
			QueueListener.logLevel === level ||
			QueueListener.logLevel === "DEBUG"
		) {
		}
	}
	static onWaiting(jobId: string): void {
		logger.info(`Job with ID ${jobId} is waiting`, "DEBUG");
		QueueListener.log(`Job with ID ${jobId} is waiting`, "DEBUG");
	}

	static onActive(
		job: Job<JobConfig>,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		jobPromise: Promise<Job<JobConfig>>,
	): void {}

	static onStalled(job: Job<JobConfig>): void {
		// console.log(`Job with ID ${job.id} stalled`);
		// TODO: log stalled request. These requests are most probably double processed.
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	static onCompleted(job: Job<JobConfig>, result: any): void {
		logger.info(`Job with ID ${job} is completed`, "DEBUG");
		QueueListener.log(`Job with ID ${job.id} completed`, "INFO");
		QueueListener.log(`Result: ${JSON.stringify(result)}`, "DEBUG");
	}

	// eslint-disable-next-line consistent-return
	static onFailed(job: Job<JobConfig>, err: Error) {
		logger.info(`Job with ID ${job} is onFailed`, "DEBUG");
	}

	static onClean(jobs: Job<JobConfig>[], type: string): void {
		const filteredJobs = jobs.filter(
			(job) =>
				job.finishedOn && Date.now() - job.finishedOn > 24 * 60 * 60 * 1000,
		); // Exemplo: jobs mais antigos que um dia
		QueueListener.log(
			`Cleaned ${filteredJobs.length} jobs of type ${type}`,
			"INFO",
		);
	}

	static onRemoved(job: Job<JobConfig>): void {
		// console.log(`Job with ID ${job.id} removed`);
	}
}
