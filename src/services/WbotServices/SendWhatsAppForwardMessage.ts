import AppError from "../../errors/AppError";
import GetTicketWbot from "../../helpers/GetTicketWbot";
import type Ticket from "../../models/Ticket";
import UserMessagesLog from "../../models/UserMessagesLog";
import { logger } from "../../utils/logger";
import fs from 'fs';

interface Request {
	message: any;
	ticket: Ticket;
	userId: number;
	contact: any
}

export const SendWhatsAppForwardMessage = async ({
	message,
	ticket,
	userId,
	contact
}: Request): Promise<void> => {
	try {
		const wbot = await GetTicketWbot(ticket);

		const wppContact = await wbot.checkNumberStatus(contact.number)

		const media = await wbot.downloadMedia(message.messageId);


		await wbot.forwardMessage(wppContact.id._serialized, message.messageId).catch(
			er => console.log(er)
		)

		await ticket.update({
			lastMessage: message.body,
			lastMessageAt: new Date().getTime(),
		});
		try {
			if (userId) {
				await UserMessagesLog.create({
					messageId: message.messageId,
					userId,
					ticketId: ticket.id,
				} as UserMessagesLog);
			}
		} catch (error) {
			logger.error(`Error criar log mensagem ${error}`);
		}


	} catch (err) {
		logger.error(`forwardMessage | Error: ${JSON.stringify(err)}`);
		// StartWhatsAppSessionVerify(ticket.whatsappId, err);
		console.log('error')
		throw new AppError("ERR_SENDING_WAPP_MSG");
	}
};
