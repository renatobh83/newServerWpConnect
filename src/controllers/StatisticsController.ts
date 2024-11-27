// import Contact from '../models/Contact';
import type { Request, RequestHandler, Response } from "express";
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

type tContactReport = {
	startDate: string;
	endDate: string;
	tags?: number[] | string[];
	ddds?: number[] | string[];
	searchParam?: string;
};

export const DashTicketsQueues: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	const { tenantId, profile, id: userId } = req.user;
	const { dateStart, dateEnd, status, queuesIds, showAll } =
		req.query as IndexQuery;

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
};

export const ContactsReport: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	const { tenantId } = req.user;
	// if (req.user.profile !== "admin") {
	//   throw new AppError("ERR_NO_PERMISSION", 403);
	// }
	const { startDate, endDate, tags, ddds, searchParam } =
		req.query as tContactReport;

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
};
