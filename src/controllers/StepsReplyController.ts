import type { Request, RequestHandler, Response } from "express";
import * as Yup from "yup";

import AppError from "../errors/AppError";
import CreateStepsReplyService from "../services/AutoReplyServices/StepsReplyServices/CreateStepsReplyService";
import DeleteStepsReplyService from "../services/AutoReplyServices/StepsReplyServices/DeleteStepsReplyService";
import UpdateStepsReplyService from "../services/AutoReplyServices/StepsReplyServices/UpdateStepsReplyService";

interface StepsReplyData {
	reply: string;
	idAutoReply: number;
	userId: number;
	initialStep: boolean;
}

export const store: RequestHandler = async (req: Request, res: Response) => {
	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}

	const newStepsReply: StepsReplyData = { ...req.body, userId: req.user.id };

	const schema = Yup.object().shape({
		reply: Yup.string().required(),
		idAutoReply: Yup.number().required(),
		userId: Yup.number().required(),
		initialStep: Yup.boolean().required(),
	});

	try {
		await schema.validate(newStepsReply);
	} catch (error) {
		throw new AppError(error.message);
	}

	const stepsReply = await CreateStepsReplyService(newStepsReply);

	res.status(200).json(stepsReply);
};

export const update: RequestHandler = async (req: Request, res: Response) => {
	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}
	const stepsReplyData: StepsReplyData = req.body;

	const schema = Yup.object().shape({
		reply: Yup.string().required(),
		idAutoReply: Yup.number().required(),
		userId: Yup.number().required(),
		initialStep: Yup.boolean().required(),
	});

	try {
		await schema.validate(stepsReplyData);
	} catch (error) {
		throw new AppError(error.message);
	}

	const { stepsReplyId } = req.params;
	const stepsReply = await UpdateStepsReplyService({
		stepsReplyData,
		stepsReplyId,
	});

	res.status(200).json(stepsReply);
};

export const remove: RequestHandler = async (req: Request, res: Response) => {
	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}
	const { stepsReplyId } = req.params;

	await DeleteStepsReplyService(stepsReplyId);
	res.status(200).json({ message: "Steps reply deleted" });
};
