
import { Queue as BullQueue } from "bullmq";
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
// import Queue from '../libs/Queue';
import { logger } from '../utils/logger';


export default async function bullMQ(app: any) {
  logger.info("bullMQ started");
  const queues = [
	{
	  queue: new BullQueue("WebHooksAPIConfirmacao", {
		connection: {
		  host: process.env.IO_REDIS_SERVER,
		  port: 6379,
		},
	  }),
	  name: "WebHooksAPIConfirmacao",
	  handle: async (job: any) => {
		console.log(`Processando job: ${job.id}`);
	  },
	  options: {
		delay: 6000,
		attempts: 5,
		backoff: { type: "fixed", delay: 180000 },
	  },
	},
  ];
  
  // Inicialize o painel do Bull
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath("/admin/queues");
  
  createBullBoard({
	queues: queues.map((q) => new BullMQAdapter(q.queue)), // Apenas `q.queue`
	serverAdapter: serverAdapter,
  });
  
  // Adicione ao Express
  app.use("/admin/queues", serverAdapter.getRouter());

}
