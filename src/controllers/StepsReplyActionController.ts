import type { NextFunction, Request, RequestHandler, Response } from "express";
import * as Yup from "yup";
import AppError from "../errors/AppError";

import CreateStepsReplyActionService from "../services/AutoReplyServices/StepsReplyActionServices/CreateStepsReplyActionService";
import DeleteStepsReplyActionService from "../services/AutoReplyServices/StepsReplyActionServices/DeleteStepsReplyActionService";
import UpdateStepsReplyActionService from "../services/AutoReplyServices/StepsReplyActionServices/UpdateStepsReplyActionService";

interface StepsReplyActionData {
	stepReplyId: number;
	words: string;
	action: number;
	userId: number;
	queueId?: number;
	userIdDestination?: number;
	nextStepId?: number;
}

export const store: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}

		const stepsReplyActionData: StepsReplyActionData = {
			...req.body,
			userId: req.user.id,
		};

		const schema = Yup.object().shape({
			stepReplyId: Yup.number().required(),
			words: Yup.number().required(),
			action: Yup.number().required(),
			userId: Yup.number().required(),
		});

		try {
			await schema.validate(stepsReplyActionData);
		} catch (error) {
			throw new AppError(error.message);
		}

		const stepsReplyAction =
			await CreateStepsReplyActionService(stepsReplyActionData);

		res.status(200).json(stepsReplyAction);
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
		const stepsReplyActionData: StepsReplyActionData = {
			...req.body,
			userId: req.user.id,
		};

		const schema = Yup.object().shape({
			stepReplyId: Yup.number().required(),
			words: Yup.number().required(),
			action: Yup.number().required(),
			userId: Yup.number().required(),
		});

		try {
			await schema.validate(stepsReplyActionData);
		} catch (error) {
			throw new AppError(error.message);
		}

		const { stepsReplyActionId } = req.params;
		const autoReply = await UpdateStepsReplyActionService({
			stepsReplyActionData,
			stepsReplyActionId,
		});

		res.status(200).json(autoReply);
	} catch (error) {
		next(error);
	}
};

export const remove: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}
		const { stepsReplyActionId } = req.params;

		await DeleteStepsReplyActionService(stepsReplyActionId);
		res.status(200).json({ message: "Auto reply deleted" });
	} catch (error) {
		next(error);
	}
};
