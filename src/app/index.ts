import { type Server, createServer } from "node:http";
import express, { type Express } from "express";
import { initIO } from "../libs/scoket";
import { StartAllWhatsAppsSessions } from "../services/WbotServices/StartAllWhatsAppsSessions";
import { logger } from "../utils/logger";
import bootstrap from "./boot";

export default async function application() {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const app: Express | any = express();
	const httpServer: Server = createServer(app);
	const port = 3100;

	await bootstrap(app);

	async function start() {
		const host = app.get("host") || "0.0.0.0";
		app.server = httpServer.listen(port, host, async () => {
			logger.info(`Web server listening at: http://${host}:${port}/`);
			await StartAllWhatsAppsSessions();
		});
		app.use(express.json());
		initIO(app.server);
	}
	async function close() {
		return new Promise<void>((resolve, reject) => {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			httpServer.close((err: any) => {
				if (err) {
					reject(err);
				}

				resolve();
			});
		});
	}
	process.on("SIGTERM", close);

	app.start = start;
	app.close = close;

	return app;
}
