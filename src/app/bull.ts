import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import type { Application } from "express";
import { addJob, processQueues, queues } from "../libs/Queue";
import { logger } from "../utils/logger";

export const redisConfig = {
	host: process.env.IO_REDIS_SERVER,
	port: +(process.env.IO_REDIS_PORT || "6379"),
	password: process.env.IO_REDIS_PASSWORD || undefined,
	db: 3,
	maxRetriesPerRequest: null,
};

export default async function bullMQ(app: Application) {
	logger.info("bullMQ started");
	processQueues(100);

	addJob("SendMessageSchenduled", {});
	addJob("VerifyTicketsChatBotInactives", {});
	// Inicialize o painel do Bull
	const serverAdapter = new ExpressAdapter();
	serverAdapter.setBasePath("/admin/queues");

	createBullBoard({
		queues: queues.map((q) => new BullMQAdapter(q.bull)), // Apenas `q.queue`
		serverAdapter: serverAdapter,
	});

	// Adicione ao Express
	app.use("/admin/queues", serverAdapter.getRouter());
}
