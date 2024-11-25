import * as Yup from "yup";
import type { Request, RequestHandler, Response } from "express";

import CreateAutoReplyService from "../services/AutoReplyServices/CreateAutoReplyService";
import AppError from "../errors/AppError";
import ListAutoReplyService from "../services/AutoReplyServices/ListAutoReplyService";
import UpdateAutoReplyService from "../services/AutoReplyServices/UpdateAutoReplyService";
import DeleteAutoReplyService from "../services/AutoReplyServices/DeleteAutoReplyService";

interface AutoReplyData {
	name: string;
	action: number;
	userId: number;
	isActive: boolean;
	celularTeste?: string;
	tenantId: number;
}

export const store: RequestHandler = async (req: Request, res: Response) => {
	const { tenantId } = req.user;
	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}

	const newAutoReply: AutoReplyData = { ...req.body, tenantId };

	const schema = Yup.object().shape({
		name: Yup.string().required(),
		action: Yup.number().required(),
		tenantId: Yup.number().required(),
		userId: Yup.number().required(),
	});

	try {
		await schema.validate(newAutoReply);
	} catch (error) {
		throw new AppError(error.message);
	}

	const autoReply = await CreateAutoReplyService(newAutoReply);

	res.status(200).json(autoReply);
};

export const index: RequestHandler = async (req: Request, res: Response) => {
	const { tenantId } = req.user;
	const autoReply = await ListAutoReplyService({ tenantId });
	res.status(200).json(autoReply);
};

export const update: RequestHandler = async (req: Request, res: Response) => {
	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}
	const { tenantId } = req.user;
	const autoReplyData: AutoReplyData = req.body;

	const schema = Yup.object().shape({
		name: Yup.string().required(),
		action: Yup.number().required(),
		userId: Yup.number().required(),
	});

	try {
		await schema.validate(autoReplyData);
	} catch (error) {
		throw new AppError(error.message);
	}

	const { autoReplyId } = req.params;
	const autoReply = await UpdateAutoReplyService({
		autoReplyData,
		autoReplyId,
		tenantId,
	});

	res.status(200).json(autoReply);
};

export const remove: RequestHandler = async (req: Request, res: Response) => {
	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}
	const { tenantId } = req.user;
	const { autoReplyId } = req.params;

	await DeleteAutoReplyService({ id: autoReplyId, tenantId });
	res.status(200).json({ message: "Auto reply deleted" });
};
