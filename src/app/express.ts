import { defaultLogger } from "@wppconnect-team/wppconnect";
import cookieParser from "cookie-parser";
import cors from "cors";
import { type Application, type NextFunction, json, urlencoded } from "express";
import helmet from "helmet";
import type { ServerOptions } from "../types/ServerOptions";
import { logger } from "../utils/logger";

export default async function express(
	app: Application,
	serverOptions: Partial<ServerOptions>,
) {
	if (typeof serverOptions !== "object") {
		serverOptions = {};
	}

	defaultLogger.level = serverOptions?.log?.level
		? serverOptions.log.level
		: "silly";

	app.use(helmet());
	app.use(cors());
	app.use(cookieParser());
	app.use(json({ limit: "50MB" }));

	app.use(
		urlencoded({ extended: true, limit: "50MB", parameterLimit: 200000 }),
	);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	app.use((req: any, res: any, next: NextFunction) => {
		req.serverOptions = serverOptions;
		next();
	});
	logger.info("express already in server!");
}
