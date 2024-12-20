import type { NextFunction, Request, RequestHandler, Response } from "express";
import * as Yup from "yup";
import AppError from "../errors/AppError";

import CreateQueueService from "../services/QueueServices/CreateQueueService";
import DeleteQueueService from "../services/QueueServices/DeleteQueueService";
import ListQueueService from "../services/QueueServices/ListQueueService";
import UpdateQueueService from "../services/QueueServices/UpdateQueueService";

interface QueueData {
	queue: string;
	isActive: boolean;
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

		const newQueue: QueueData = { ...req.body, userId: req.user.id, tenantId };

		const schema = Yup.object().shape({
			queue: Yup.string().required(),
			userId: Yup.number().required(),
			tenantId: Yup.number().required(),
		});

		try {
			await schema.validate(newQueue);
		} catch (error) {
			throw new AppError(error.message);
		}

		const queue = await CreateQueueService(newQueue);

		res.status(200).json(queue);
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
		const queues = await ListQueueService({ tenantId });
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
		const queueData: QueueData = { ...req.body, userId: req.user.id, tenantId };

		const schema = Yup.object().shape({
			queue: Yup.string().required(),
			isActive: Yup.boolean().required(),
			userId: Yup.number().required(),
		});

		try {
			await schema.validate(queueData);
		} catch (error) {
			throw new AppError(error.message);
		}

		const { queueId } = req.params;
		const queueObj = await UpdateQueueService({
			queueData,
			queueId,
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
		const { queueId } = req.params;

		await DeleteQueueService({ id: queueId, tenantId });
		res.status(200).json({ message: "Queue deleted" });
	} catch (error) {
		next(error);
	}
};
