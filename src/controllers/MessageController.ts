import type { Request, RequestHandler, Response } from "express";
import AppError from "../errors/AppError";
import DeleteMessageSystem from "../helpers/DeleteMessageSystem";
// import GetTicketWbot from "../helpers/GetTicketWbot";

import SetTicketMessagesAsRead from "../helpers/SetTicketMessagesAsRead";
import type Message from "../models/Message";
import CreateForwardMessageService from "../services/MessageServices/CreateForwardMessageService";
// import CreateMessageOffilineService from "../services/MessageServices/CreateMessageOfflineService";
import CreateMessageSystemService from "../services/MessageServices/CreateMessageSystemService";

import ListMessagesService from "../services/MessageServices/ListMessagesService";
import ShowTicketService from "../services/TicketServices/ShowTicketService";

import { logger } from "../utils/logger";
// import SendWhatsAppMedia from "../services/WbotServices/SendWhatsAppMedia";
// import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage";

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

export const index: RequestHandler = async (req: Request, res: Response) => {
	const { ticketId } = req.params;
	const { pageNumber } = req.query as IndexQuery;
	const { tenantId } = req.user;

	const { count, messages, messagesOffLine, ticket, hasMore } =
		await ListMessagesService({
			pageNumber,
			ticketId,
			tenantId,
		});
	try {
		SetTicketMessagesAsRead(ticket);
	} catch (error) {
		console.log("SetTicketMessagesAsRead", error);
	}

	res.json({ count, messages, messagesOffLine, ticket, hasMore });
};

export const store: RequestHandler = async (req: Request, res: Response) => {
	const { ticketId } = req.params;
	const { tenantId, id: userId } = req.user;
	const messageData: MessageData = req.body;
	const medias = req.files as Express.Multer.File[];
	const ticket = await ShowTicketService({ id: ticketId, tenantId });
	// console.log(ticket)
	try {
		SetTicketMessagesAsRead(ticket);
	} catch (error) {
		console.log("SetTicketMessagesAsRead", error);
	}

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
};

export const remove: RequestHandler = async (req: Request, res: Response) => {
	const { messageId } = req.params;
	const { tenantId } = req.user;
	try {
		await DeleteMessageSystem(req.body.id, messageId, tenantId);
	} catch (error) {
		logger.error(`ERR_DELETE_SYSTEM_MSG: ${error}`);
		throw new AppError("ERR_DELETE_SYSTEM_MSG");
	}

	res.send();
};

export const forward: RequestHandler = async (req: Request, res: Response) => {
	const data = req.body;
	const { user } = req;
	const userIdNumber = Number(user.id);

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
};
