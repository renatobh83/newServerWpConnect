import type { Request, RequestHandler, Response } from "express";
// import * as Yup from "yup";
import DashTicketsAndTimes from "../../services/Statistics/DashTicketsAndTimes";
import DashTicketsChannels from "../../services/Statistics/DashTicketsChannels";
import DashTicketsEvolutionByPeriod from "../../services/Statistics/DashTicketsEvolutionByPeriod";
import DashTicketsEvolutionChannels from "../../services/Statistics/DashTicketsEvolutionChannels";
import DashTicketsPerUsersDetail from "../../services/Statistics/DashTicketsPerUsersDetail";
import DashTicketsQueue from "../../services/Statistics/DashTicketsQueue";
// import AppError from "../errors/AppError";

type IndexQuery = {
	startDate: string;
	endDate: string;
};

export const getDashTicketsAndTimes: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	const { tenantId } = req.user;
	const { startDate, endDate } = req.query as IndexQuery;
	const userId = req.user.id;
	const userProfile = req.user.profile;

	const data = await DashTicketsAndTimes({
		startDate,
		endDate,
		tenantId,
		userId,
		userProfile,
	});

	res.json(data);
};

export const getDashTicketsChannels: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	const { tenantId } = req.user;
	const { startDate, endDate } = req.query as IndexQuery;
	const userId = req.user.id;
	const userProfile = req.user.profile;

	const data = await DashTicketsChannels({
		startDate,
		endDate,
		tenantId,
		userId,
		userProfile,
	});

	res.json(data);
};

export const getDashTicketsEvolutionChannels: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	const { tenantId } = req.user;
	const { startDate, endDate } = req.query as IndexQuery;
	const userId = req.user.id;
	const userProfile = req.user.profile;

	const data = await DashTicketsEvolutionChannels({
		startDate,
		endDate,
		tenantId,
		userId,
		userProfile,
	});

	res.json(data);
};

export const getDashTicketsEvolutionByPeriod: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	const { tenantId } = req.user;
	const { startDate, endDate } = req.query as IndexQuery;
	const userId = req.user.id;
	const userProfile = req.user.profile;

	const data = await DashTicketsEvolutionByPeriod({
		startDate,
		endDate,
		tenantId,
		userId,
		userProfile,
	});

	res.json(data);
};

export const getDashTicketsPerUsersDetail: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	const { tenantId } = req.user;
	const { startDate, endDate } = req.query as IndexQuery;
	const userId = req.user.id;
	const userProfile = req.user.profile;

	const data = await DashTicketsPerUsersDetail({
		startDate,
		endDate,
		tenantId,
		userId,
		userProfile,
	});

	res.json(data);
};

export const getDashTicketsQueue: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	const { tenantId } = req.user;
	const { startDate, endDate } = req.query as IndexQuery;
	const userId = req.user.id;
	const userProfile = req.user.profile;

	const data = await DashTicketsQueue({
		startDate,
		endDate,
		tenantId,
		userId,
		userProfile,
	});

	res.json(data);
};
