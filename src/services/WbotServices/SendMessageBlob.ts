import AppError from "../../errors/AppError";
import GetTicketWbot from "../../helpers/GetTicketWbot";
import type Ticket from "../../models/Ticket";
import UserMessagesLog from "../../models/UserMessagesLog";
import { logger } from "../../utils/logger";

interface Request {
	base64Html: string;
	ticket: Ticket;
	userId: number;
}

const SendMessageBlob = async ({
	base64Html,
	ticket,
	userId,
}: Request): Promise<void> => {
	// try {
	// 	const wbot = await GetTicketWbot(ticket);
	// 	const media = new MessageMedia("text/html", base64Html, "Preparo");
	// 	const sendMessage = await wbot.sendMessage(
	// 		`${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`,
	// 		media,
	// 		{ sendAudioAsVoice: true },
	// 	);
	// 	await ticket.update({
	// 		lastMessage: "arquivo.html",
	// 		lastMessageAt: new Date().getTime(),
	// 	});
	// 	try {
	// 		if (userId) {
	// 			await UserMessagesLog.create({
	// 				messageId: sendMessage.id.id,
	// 				userId,
	// 				ticketId: ticket.id,
	// 			});
	// 		}
	// 	} catch (error) {
	// 		logger.error(`Error criar log mensagem ${error}`);
	// 	}
	// 	return sendMessage;
	// } catch (err) {
	// 	console.log(err);
	// 	logger.error(`SendWhatsBlob | Error: ${err}`);
	// 	// StartWhatsAppSessionVerify(ticket.whatsappId, err);
	// 	throw new AppError("ERR_SENDING_WAPP_MSG");
	// }
};

export default SendMessageBlob;
