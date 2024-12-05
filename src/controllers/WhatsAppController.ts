import type { NextFunction, Request, RequestHandler, Response } from "express";

// import { removeWbot } from "../libs/wbot";
import AppError from "../errors/AppError";

import { getIO } from "../libs/scoket";
import { removeWbot } from "../libs/wbot";
import CreateWhatsAppService from "../services/WhatsappService/CreateWhatsAppService";
import DeleteWhatsAppService from "../services/WhatsappService/DeleteWhatsAppService";
import ListWhatsAppsService from "../services/WhatsappService/ListWhatsAppsService";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";

export const index: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	try {
		const whatsapps = await ListWhatsAppsService(tenantId);

		res.status(200).json(whatsapps);
	} catch (error) {
		next(error);
	}
};

export const show: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { whatsappId } = req.params;
	const { tenantId } = req.user;
	try {
		const whatsapp = await ShowWhatsAppService({ id: whatsappId, tenantId });

		res.status(200).json(whatsapp);
	} catch (error) {
		next(error);
	}
};

export const store: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { whatsappId } = req.params;
	const whatsappData = req.body;
	const { tenantId } = req.user;
	try {
		const whatsapps = await ListWhatsAppsService(tenantId);

		if (whatsapps.length >= Number(process.env.CONNECTIONS_LIMIT)) {
			throw new AppError("ERR_NO_PERMISSION_CONNECTIONS_LIMIT", 400);
		}

		const { whatsapp } = await CreateWhatsAppService({
			...whatsappData,
			whatsappId,
			tenantId,
		});

		res.status(200).json(whatsapp);
	} catch (error) {
		next(error);
	}
};

export const update: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { whatsappId } = req.params;
	const whatsappData = req.body;
	const { tenantId } = req.user;
	try {
		const { whatsapp } = await UpdateWhatsAppService({
			whatsappData,
			whatsappId,
			tenantId,
		});

		res.status(200).json(whatsapp);
	} catch (error) {
		next(error);
	}
};

export const remove: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { whatsappId } = req.params;
	const { tenantId } = req.user;
	try {
		await DeleteWhatsAppService(whatsappId, tenantId);
		removeWbot(+whatsappId);

		const io = getIO();
		io.emit(`${tenantId}:whatsapp`, {
			action: "delete",
			whatsappId: +whatsappId,
		});

		res.status(200).json({ message: "Whatsapp deleted." });
	} catch (error) {
		next(error);
	}
};
