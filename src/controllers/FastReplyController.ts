import type { NextFunction, Request, RequestHandler, Response } from "express";
import * as Yup from "yup";
import AppError from "../errors/AppError";

import CreateFastReplyService from "../services/FastReplyServices/CreateFastReplyService";
import DeleteFastReplyService from "../services/FastReplyServices/DeleteFastReplyService";
import ListFastReplyService from "../services/FastReplyServices/ListFastReplyService";
import UpdateFastReplyService from "../services/FastReplyServices/UpdateFastReplyService";

interface FastReplyData {
	key: string;
	message: string;
	userId: number;
	tenantId: number;
}

export const store: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}

		const newReply: FastReplyData = {
			...req.body,
			userId: req.user.id,
			tenantId,
		};

		const schema = Yup.object().shape({
			key: Yup.string().required(),
			message: Yup.string().required(),
			userId: Yup.number().required(),
			tenantId: Yup.number().required(),
		});

		try {
			await schema.validate(newReply);
		} catch (error) {
			throw new AppError(error.message);
		}

		const reply = await CreateFastReplyService(newReply);

		res.status(200).json(reply);
	} catch (error) {
		next(error);
	}
};

export const index: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	try {
		const queues = await ListFastReplyService({ tenantId });
		res.status(200).json(queues);
	} catch (error) {
		next(error);
	}
};

export const update: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}
		const fastReplyData: FastReplyData = {
			...req.body,
			userId: req.user.id,
			tenantId,
		};

		const schema = Yup.object().shape({
			key: Yup.string().required(),
			message: Yup.string().required(),
			userId: Yup.number().required(),
		});

		try {
			await schema.validate(fastReplyData);
		} catch (error) {
			throw new AppError(error.message);
		}

		const { fastReplyId } = req.params;
		const queueObj = await UpdateFastReplyService({
			fastReplyData,
			fastReplyId,
		});

		res.status(200).json(queueObj);
	} catch (error) {
		next(error);
	}
};

export const remove: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}
		const { fastReplyId } = req.params;

		await DeleteFastReplyService({ id: fastReplyId, tenantId });
		res.status(200).json({ message: "Fast Reply deleted" });
	} catch (error) {
		next(error);
	}
};
