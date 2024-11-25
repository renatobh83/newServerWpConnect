// import { createBullBoard } from "@bull-board/api";
// import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
// import { ExpressAdapter } from "@bull-board/express";
// import Queue from "../libs/Queue";

// export default async function bullMQ(app: any) {
// 	console.info("bullMQ started");
// 	Queue.process();

// 	// await Queue.add("VerifyTicketsChatBotInactives", {});
// 	// await Queue.add("SendMessageSchenduled", {});

// 	if (process.env.NODE_ENV !== "production") {
// 		const serverAdapter = new ExpressAdapter();
// 		serverAdapter.setBasePath("/admin/queues");

// 		createBullBoard({
// 			queues: Queue.queues.map((q: any) => new BullMQAdapter(q.bull)),
// 			serverAdapter: serverAdapter,
// 		});

// 		app.use("/admin/queues", serverAdapter.getRouter());
// 	}
// }
// import { createBullBoard } from "@bull-board/api";
// import { BullAdapter } from "@bull-board/api/bullAdapter"; // Use BullAdapter em vez de BullMQAdapter
// import { ExpressAdapter } from "@bull-board/express";
// import Queue from "../libs/Queue";

// export default async function bullMQ(app: any) {
// 	console.info("bullMQ started");
// 	Queue.process();

// 	if (process.env.NODE_ENV !== "production") {
// 		const serverAdapter = new ExpressAdapter();
// 		serverAdapter.setBasePath("/admin/queues");

// 		createBullBoard({
// 			queues: Queue.queues.map((q: any) => new BullAdapter(q.bull)), // Use BullAdapter
// 			serverAdapter: serverAdapter,
// 		});

// 		app.use("/admin/queues", serverAdapter.getRouter());
// 	}
// }
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import Queue from "../libs/Queue";
import { logger } from "../utils/logger";

export default async function bullMQ(app: any) {
	logger.info("bullMQ started");

	Queue.process(); // Inicia o processamento dos jobs

	if (process.env.NODE_ENV !== "production") {
		const serverAdapter = new ExpressAdapter();
		serverAdapter.setBasePath("/admin/queues");

		createBullBoard({
			queues: Queue.queues.map((q: any) => new BullMQAdapter(q.bull)), // BullMQAdapter
			serverAdapter: serverAdapter,
		});

		app.use("/admin/queues", serverAdapter.getRouter());
	}
}
