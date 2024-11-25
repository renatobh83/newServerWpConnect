import type { Application, NextFunction, Request, Response } from "express";
import expressInstance from "express";
import uploadConfig from "../config/upload";
import AppError from "../errors/AppError";
import routes from "../routes";
import { logger } from "../utils/logger";

export default async function modules(app: Application): Promise<void> {
	app.use("/public", expressInstance.static(uploadConfig.directory));
	app.use(routes);

	app.use(async (err: Error, _req: Request, res: Response, _: NextFunction) => {
		if (err instanceof AppError) {
			if (err.statusCode === 403) {
				logger.warn(err);
			} else {
				logger.error(err);
			}
			res.status(err.statusCode).json({ error: err.message });
		}

		logger.error(err);
		res.status(500).json({ error: `Internal server error: ${err}` });
	});
	logger.info("modules routes already in server!");
}
