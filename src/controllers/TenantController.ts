import { isMatch } from "date-fns";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import * as Yup from "yup";
import AppError from "../errors/AppError";

import ShowBusinessHoursAndMessageService from "../services/TenantServices/ShowBusinessHoursAndMessageService";
import UpdateBusinessHoursService from "../services/TenantServices/UpdateBusinessHoursService";
import UpdateMessageBusinessHoursService from "../services/TenantServices/UpdateMessageBusinessHoursService";

export const updateBusinessHours: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}

		const businessHours = req.body;

		const schema = Yup.array().of(
			Yup.object().shape({
				day: Yup.number().required().integer(),
				label: Yup.string().required(),
				type: Yup.string().required(),
				hr1: Yup.string()
					.required()
					.test("isHoursValid", "${path} is not valid", (value) =>
						isMatch(value || "", "HH:mm"),
					),

				hr2: Yup.string()
					.required()
					.test("isHoursValid", "${path} is not valid", (value) =>
						isMatch(value || "", "HH:mm"),
					),
				hr3: Yup.string()
					.required()
					.test("isHoursValid", "${path} is not valid", (value) =>
						isMatch(value || "", "HH:mm"),
					),
				hr4: Yup.string()
					.required()
					.test("isHoursValid", "${path} is not valid", (value) =>
						isMatch(value || "", "HH:mm"),
					),
			}),
		);

		try {
			await schema.validate(businessHours);
		} catch (error) {
			throw new AppError(error.message);
		}

		const newBusinessHours = await UpdateBusinessHoursService({
			businessHours,
			tenantId,
		});

		res.status(200).json(newBusinessHours);
	} catch (error) {
		next(error);
	}
};

export const updateMessageBusinessHours: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}

		const { messageBusinessHours } = req.body;

		if (!messageBusinessHours) {
			throw new AppError("ERR_NO_MESSAGE_INFORMATION", 404);
		}

		const newBusinessHours = await UpdateMessageBusinessHoursService({
			messageBusinessHours,
			tenantId,
		});

		res.status(200).json(newBusinessHours);
	} catch (error) {
		next(error);
	}
};

export const showBusinessHoursAndMessage: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	try {
		const tenant = await ShowBusinessHoursAndMessageService({ tenantId });

		res.status(200).json(tenant);
	} catch (error) {
		next(error);
	}
};
