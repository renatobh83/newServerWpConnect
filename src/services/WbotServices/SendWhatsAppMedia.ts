import fs from "node:fs";

import type { Message } from "@wppconnect-team/wppconnect";
import AppError from "../../errors/AppError";
import GetTicketWbot from "../../helpers/GetTicketWbot";
import type Ticket from "../../models/Ticket";
import UserMessagesLog from "../../models/UserMessagesLog";
import { logger } from "../../utils/logger";

interface Request {
	media: any;
	ticket: Ticket;
	userId: number;
}

const SendWhatsAppMedia = async ({
	media,
	ticket,
	userId,
}: Request): Promise<Message> => {
	try {
		const wbot = await GetTicketWbot(ticket);

		const pathFile = media.path;
		if (pathFile) {
			throw new AppError("ERR_SENDING_WAPP_MSG");
		}

		const sendMessage = await wbot.sendFile(
			`${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`,
			pathFile,
			{
				filename: media.originalName,
			},
		);

		await ticket.update({
			lastMessage: media.filename,
			lastMessageAt: new Date().getTime(),
		});
		try {
			if (userId) {
				await UserMessagesLog.create({
					messageId: sendMessage.id,
					userId,
					ticketId: ticket.id,
				} as UserMessagesLog);
			}
		} catch (error) {
			logger.error(`Error criar log mensagem ${error}`);
		}
		// fs.unlinkSync(pathFile);

		return sendMessage;
	} catch (err) {
		logger.error(`SendWhatsAppMedia | Error: ${err}`);
		// StartWhatsAppSessionVerify(ticket.whatsappId, err);
		throw new AppError("ERR_SENDING_WAPP_MSG");
	}
};

export default SendWhatsAppMedia;
