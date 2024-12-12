import { type Server, createServer } from "node:http";
import express, {  type Express } from "express";
import { initIO } from "../libs/scoket";
import { StartAllWhatsAppsSessions } from "../services/WbotServices/StartAllWhatsAppsSessions";
import { logger } from "../utils/logger";
import bootstrap from "./boot";

import GracefulShutdown from "http-graceful-shutdown";
import { shutdown} from "../libs/Queue";


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
		GracefulShutdown(app.server);
	}
	async function close() {
		try {
			logger.info("Iniciando encerramento da aplicação...");

			// Fechar o servidor HTTP
			await new Promise<void>((resolve, reject) => {
				httpServer.close((err: any) => {
					if (err) {
						logger.error("Erro ao encerrar o servidor HTTP:", err);
						return reject(err);
					}
					logger.info("Servidor HTTP encerrado com sucesso.");
					resolve();
				});
			});

			await shutdown()

			logger.info("Encerramento da aplicação concluído com sucesso.");
			process.exit(0); // Encerrar o processo após o fechamento completo
		} catch (error) {
			logger.error("Erro durante o encerramento da aplicação:", error);
			process.exit(1); // Sinalizar falha no encerramento
		}
	}
	process.on("SIGTERM", close); // Para encerramento via SIGTERM (ex.: Docker, Kubernetes)
	process.on("SIGINT", close);

	app.start = start;
	app.close = close;

	return app;
}
