import type { NextFunction, Request, RequestHandler, Response } from "express";
// import * as Yup from "yup";
import StatisticsPerUser from "../../services/Statistics/StatisticsPerUsers";
// import AppError from "../errors/AppError";

type IndexQuery = {
	startDate: string;
	endDate: string;
};

export const index: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	const { startDate, endDate } = req.query as IndexQuery;
	try {
		const data = await StatisticsPerUser({
			startDate,
			endDate,
			tenantId,
		});

		res.json(data);
	} catch (error) {
		next(error);
	}
};
