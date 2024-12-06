import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import type { Application } from "express";
// import { addJob, processQueues, queues } from "../libs/Queue";
import { logger } from "../utils/logger";
import Queue from "../libs/Queue";

// export const redisConfig = {
// 	host: process.env.IO_REDIS_SERVER,
// 	port: +(process.env.IO_REDIS_PORT || "6379"),
// 	password: process.env.IO_REDIS_PASSWORD || undefined,
// 	db: 3,
// 	maxRetriesPerRequest: null,
// };

export default async function bullMQ(app: Application) {
	logger.info("bullMQ started");

	await Queue.process();


	await Queue.add("VerifyTicketsChatBotInactives", {});
	await Queue.add("SendMessageSchenduled", {});

	// Inicialize o painel do Bull
	const serverAdapter = new ExpressAdapter();
	serverAdapter.setBasePath("/admin/queues");

	createBullBoard({
		queues: Queue.queues.map((q) => new BullAdapter(q.bull)),
		serverAdapter: serverAdapter,
	});

	// // Adicione ao Express
	app.use("/admin/queues", serverAdapter.getRouter());
}
