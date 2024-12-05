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
	app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
		if (res.headersSent) {
			return next(err); // Deixa que o Express lide com o erro
		}
		if (err instanceof AppError) {
			if (err.statusCode === 403) {
				logger.warn(err);
			} else {
				logger.error(err);
			}
			res.status(err.statusCode).json({ error: err.message }); // Adicione o `return`
		} else {
			logger.error(err);
			res.status(500).json({ error: `Internal server error: ${err.message}` }); // Adicione o `return`
		}
	});
	logger.info("modules routes already in server!");
}
