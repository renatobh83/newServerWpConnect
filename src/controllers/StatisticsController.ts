// import Contact from '../models/Contact';
import type { NextFunction, Request, RequestHandler, Response } from "express";
import AppError from "../errors/AppError";
import ContactsReportService from "../services/Statistics/ContactsReportService";
import TicketsQueuesService from "../services/Statistics/TicketsQueuesService";

type IndexQuery = {
	dateStart: string;
	dateEnd: string;
	status: string[];
	queuesIds: string[];
	showAll: string;
};

type TContactReport = {
	startDate: string;
	endDate: string;
	tags?: number[] | string[];
	ddds?: number[] | string[];
	searchParam?: string;
};

export const DashTicketsQueues: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId, profile, id: userId } = req.user;

	const { dateStart, dateEnd, status, queuesIds, showAll } =
		req.query as IndexQuery;
	try {
		const tickets = await TicketsQueuesService({
			showAll: profile === "admin" ? showAll : false,
			dateStart,
			dateEnd,
			status,
			queuesIds,
			userId,
			tenantId,
		});

		res.status(200).json(tickets);
	} catch (error) {
		next(error);
	}
};

export const ContactsReport: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}
		const { startDate, endDate, tags, ddds, searchParam } =
			req.query as TContactReport;

		const tickets = await ContactsReportService({
			startDate,
			endDate,
			tags,
			ddds,
			tenantId,
			profile: req.user.profile,
			userId: +req.user.id,
			searchParam,
		});

		res.status(200).json(tickets);
	} catch (error) {
		next(error);
	}
};
