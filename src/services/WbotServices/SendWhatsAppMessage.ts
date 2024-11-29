import type { Message as WbotMessage } from "@wppconnect-team/wppconnect";
import AppError from "../../errors/AppError";
import GetTicketWbot from "../../helpers/GetTicketWbot";
import type Message from "../../models/Message";
import type Ticket from "../../models/Ticket";
import UserMessagesLog from "../../models/UserMessagesLog";
import { logger } from "../../utils/logger";
// import { StartWhatsAppSessionVerify } from "./StartWhatsAppSessionVerify";

interface Request {
	body: string;
	ticket: Ticket;
	quotedMsg?: Message;
	userId?: number;
}

const SendWhatsAppMessage = async ({
	body,
	ticket,
	quotedMsg,
	userId,
}: Request): Promise<WbotMessage> => {
	let quotedMsgSerializedId: string | undefined;

	if (quotedMsg) {
		quotedMsgSerializedId = quotedMsg.messageId;
	}

	const wbot = await GetTicketWbot(ticket);
	try {
		const sendMessage = await wbot.sendText(
			`${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`,
			body,
			{
				quotedMsg: quotedMsgSerializedId,
				waitForAck: false, // fix: send a message takes 2 seconds when there's a link on message body
			},
		);

		await ticket.update({
			lastMessage: body,
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
		return sendMessage;
	} catch (err) {
		logger.error(`SendWhatsAppMessage | Error: ${err}`);
		// await StartWhatsAppSessionVerify(ticket.whatsappId, err);
		throw new AppError("ERR_SENDING_WAPP_MSG");
	}
};

export default SendWhatsAppMessage;
