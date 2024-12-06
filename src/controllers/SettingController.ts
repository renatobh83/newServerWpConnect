import type { NextFunction, Request, RequestHandler, Response } from "express";

import AppError from "../errors/AppError";

import { getIO } from "../libs/scoket";
import ListSettingsService from "../services/SettingServices/ListSettingsService";
import UpdateSettingService from "../services/SettingServices/UpdateSettingService";

export const index: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		// if (req.user.profile !== "admin") {
		// 	throw new AppError("ERR_NO_PERMISSION", 403);
		// }
		const { tenantId } = req.user;

		const settings = await ListSettingsService(tenantId);

		res.status(200).json(settings);
	} catch (error) {
		next(error);
	}
};

export const update: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}
		const { tenantId } = req.user;
		// const { settingKey: key } = req.params;
		const { value, key } = req.body;

		const setting = await UpdateSettingService({
			key,
			value,
			tenantId,
		});

		const io = getIO();
		io.emit(`${tenantId}:settings`, {
			action: "update",
			setting,
		});

		res.status(200).json(setting);
	} catch (error) {
		next(error);
	}
};
