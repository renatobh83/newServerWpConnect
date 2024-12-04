import type {
	Application,
	ErrorRequestHandler,
	NextFunction,
	Request,
	Response,
} from "express";
import expressInstance from "express";
import uploadConfig from "../config/upload";
import AppError from "../errors/AppError";
import routes from "../routes/index";
import { logger } from "../utils/logger";

export default async function modules(app: Application): Promise<void> {
	app.use("/public", expressInstance.static(uploadConfig.directory));
	app.use(routes);

	logger.info("modules routes already in server!");
}
