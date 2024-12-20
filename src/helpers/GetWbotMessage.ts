import type { Message } from "@wppconnect-team/wppconnect";
import AppError from "../errors/AppError";
import type Ticket from "../models/Ticket";
import { logger } from "../utils/logger";
import GetTicketWbot from "./GetTicketWbot";

type CustomWbotMessage = Omit<Message, "id"> & {
	id: { _serialized: string }; // Redefinindo o tipo de `id`
};
export const GetWbotMessage = async (
	ticket: Ticket,
	messageId: string,
	totalMessages = 100,
): Promise<CustomWbotMessage | undefined> => {
	const wbot = await GetTicketWbot(ticket);

	const wbotChat = await wbot.getMessages(
		`${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`,
	);

	let limit = 20;

	const fetchWbotMessagesGradually = async (): Promise<Message | undefined> => {
		const chatMessages = wbotChat.slice(0, limit);
		const msgFound = chatMessages.find((msg) => msg.id === messageId);

		// console.log("chatMessages", chatMessages);
		if (!msgFound && limit < totalMessages) {
			limit += 20;
			return fetchWbotMessagesGradually();
		}
		return msgFound;
	};

	try {
		const msgFound =
			(await fetchWbotMessagesGradually()) as unknown as CustomWbotMessage;

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
