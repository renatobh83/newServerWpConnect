import type Ticket from "../models/Ticket";
import GetTicketWbot from "./GetTicketWbot";
import AppError from "../errors/AppError";
import { logger } from "../utils/logger";
import type { Chat } from "@wppconnect-team/wppconnect";

export const GetWbotMessage = async (
	ticket: Ticket,
	messageId: string,
	totalMessages = 100,
): Promise<Chat | undefined> => {
	const wbot = await GetTicketWbot(ticket);

	const wbotChat = await wbot.getChatById(
		`${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`,
	);

	const limit = 20;

	const fetchWbotMessagesGradually = async (): Promise<void> => {
		// const chatMessages = await wbotChat.fetchMessages({ limit });
		// const msgFound = chatMessages.find((msg) => msg.id.id === messageId);
		// if (!msgFound && limit < totalMessages) {
		// 	limit += 20;
		// 	return fetchWbotMessagesGradually();
		// }
		// return msgFound;
	};

	try {
		const msgFound = await fetchWbotMessagesGradually();
		return;
		if (!msgFound) {
			console.error(
				`Cannot found message within ${totalMessages} last messages`,
			);
			return undefined;
		}

		return msgFound;
	} catch (err) {
		logger.error(err);
		throw new AppError("ERR_FETCH_WAPP_MSG");
	}
};

export default GetWbotMessage;
