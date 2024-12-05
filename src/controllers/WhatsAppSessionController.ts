import type { NextFunction, Request, RequestHandler, Response } from "express";
import AppError from "../errors/AppError";
import { getIO } from "../libs/scoket";
import { getWbot, removeWbot } from "../libs/wbot";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";
import * as logger from "../utils/logger";

const store: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { whatsappId } = req.params;
	const { tenantId } = req.user;
	try {
		const whatsapp = await ShowWhatsAppService({
			id: whatsappId,
			tenantId,
			isInternal: true,
		});

		StartWhatsAppSession(whatsapp);

		res.status(200).json({ message: "Starting session." });
	} catch (error) {
		next(error);
	}
};

const update: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { whatsappId } = req.params;
	const { isQrcode } = req.body;
	const { tenantId } = req.user;
	try {
		if (isQrcode) {
			// await apagarPastaSessao(whatsappId);
		}

		const { whatsapp } = await UpdateWhatsAppService({
			whatsappId,
			whatsappData: { session: "" },
			tenantId,
		});

		// await apagarPastaSessao(whatsappId);
		StartWhatsAppSession(whatsapp);
		res.status(200).json({ message: "Starting session." });
	} catch (error) {
		next(error);
	}
};

const remove: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { whatsappId } = req.params;
	const { tenantId } = req.user;
	try {
		const channel = await ShowWhatsAppService({ id: whatsappId, tenantId });

		const io = getIO();

		try {
			if (channel.type === "whatsapp") {
				await removeWbot(channel.id);
			}

			await channel.update({
				status: "DISCONNECTED",
				session: "",
				qrcode: null,
				retries: 0,
			});
		} catch (error) {
			logger.logger.error(error);
			await channel.update({
				status: "DISCONNECTED",
				session: "",
				qrcode: null,
				retries: 0,
			});

			io.emit(`${channel.tenantId}:whatsappSession`, {
				action: "update",
				session: channel,
			});
			throw new AppError("ERR_NO_WAPP_FOUND", 404);
		}
		res.status(200).json({ message: "Session disconnected." });
	} catch (error) {
		next(error);
	}
};

export default { store, remove, update };
