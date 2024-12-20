import type { NextFunction, Request, RequestHandler, Response } from "express";
import AppError from "../errors/AppError";
import DeleteMessageSystem from "../helpers/DeleteMessageSystem";

import SetTicketMessagesAsRead from "../helpers/SetTicketMessagesAsRead";
import type Message from "../models/Message";
import CreateForwardMessageService from "../services/MessageServices/CreateForwardMessageService";
import CreateMessageSystemService from "../services/MessageServices/CreateMessageSystemService";

import ListMessagesService from "../services/MessageServices/ListMessagesService";
import ShowTicketService from "../services/TicketServices/ShowTicketService";

import { logger } from "../utils/logger";

type IndexQuery = {
	pageNumber: string;
};

type MessageData = {
	body: string;
	fromMe: boolean;
	read: boolean;
	sendType?: string;
	scheduleDate?: string | Date;
	quotedMsg?: Message;
	idFront?: string;
};

export const index: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { ticketId } = req.params;
	const { pageNumber } = req.query as IndexQuery;
	const { tenantId } = req.user;
	try {
		const { count, messages, messagesOffLine, ticket, hasMore } =
			await ListMessagesService({
				pageNumber,
				ticketId,
				tenantId,
			});

		try {
			SetTicketMessagesAsRead(ticket);
		} catch (_error) { }

		res.json({ count, messages, messagesOffLine, ticket, hasMore });
	} catch (error) {
		next(error);
	}
};

export const store: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { ticketId } = req.params;
	const { tenantId, id: userId } = req.user;
	const messageData: MessageData = req.body;
	const medias = req.files as Express.Multer.File[];
	try {
		const ticket = await ShowTicketService({ id: ticketId, tenantId });


		try {
			SetTicketMessagesAsRead(ticket);
		} catch (_error) { }

		await CreateMessageSystemService({
			msg: messageData,
			tenantId,
			medias,
			ticket,
			userId,
			scheduleDate: messageData.scheduleDate,
			sendType: messageData.sendType || "chat",
			status: "pending",
			idFront: messageData.idFront,
		});

		res.send();
	} catch (error) {
		next(error);
	}
};

export const remove: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { messageId } = req.params;
	const { tenantId } = req.user;
	try {
		await DeleteMessageSystem(req.body.id, messageId, tenantId);
		res.send();
	} catch (error) {
		next(error);
	}
};

export const forward: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const data = req.body;
	const { user } = req;
	const userIdNumber = Number(user.id);
	try {
		for (const message of data.messages) {
			await CreateForwardMessageService({
				userId: userIdNumber,
				tenantId: user.tenantId,
				message,
				contact: data.contact,
				ticketIdOrigin: message.ticketId,
			});
		}

		res.send();
	} catch (error) {
		next(error);
	}
};
