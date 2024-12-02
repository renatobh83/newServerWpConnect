import type { Request, RequestHandler, Response } from "express";
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

export const store: RequestHandler = async (req: Request, res: Response) => {
	const { tenantId } = req.user;
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
		const err = error as Error;
		throw new AppError(err.message);
	}

	const queue = await CreateQueueService(newQueue);

	res.status(200).json(queue);
};

export const index: RequestHandler = async (req: Request, res: Response) => {
	const { tenantId } = req.user;
	const queues = await ListQueueService({ tenantId });
	res.status(200).json(queues);
};

export const update: RequestHandler = async (req: Request, res: Response) => {
	const { tenantId } = req.user;

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
		const err = error as Error;
		throw new AppError(err.message);
	}

	const { queueId } = req.params;
	const queueObj = await UpdateQueueService({
		queueData,
		queueId,
	});

	res.status(200).json(queueObj);
};

export const remove: RequestHandler = async (req: Request, res: Response) => {
	const { tenantId } = req.user;
	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}
	const { queueId } = req.params;

	await DeleteQueueService({ id: queueId, tenantId });
	res.status(200).json({ message: "Queue deleted" });
};
