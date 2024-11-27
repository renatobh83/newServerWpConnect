import { join } from "node:path";
import { promisify } from "node:util";
import { writeFile } from "node:fs";
import type Contact from "../../../models/Contact";
import type Ticket from "../../../models/Ticket";
import type Message from "../../../models/Message";
import VerifyQuotedMessage from "./VerifyQuotedMessage";
import CreateMessageService from "../../MessageServices/CreateMessageService";
import { logger } from "../../../utils/logger";
import type {
	Message as WbotMessage,
	Whatsapp,
} from "@wppconnect-team/wppconnect";

const writeFileAsync = promisify(writeFile);

const VerifyMediaMessage = async (
	msg: WbotMessage,
	ticket: Ticket,
	contact: Contact,
	wbot: Whatsapp,
	// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
): Promise<Message | void> => {
	const quotedMsg = await VerifyQuotedMessage(msg);

	const media = await wbot.downloadMedia(msg);
	const matches = media.match(/^data:(.+);base64,(.+)$/);
	const base64Data = matches ? matches[2] : media;
	if (!base64Data) {
		logger.error(`ERR_WAPP_DOWNLOAD_MEDIA:: ID: ${msg.id}`);
		return;
	}

	const fileData = Buffer.from(base64Data, "base64");

	try {
		await writeFileAsync(
			join(__dirname, "..", "..", "..", "..", "public", `${msg.id}.jpeg`),
			fileData,
		);
	} catch (err) {
		logger.error(err);
	}

	const messageData = {
		messageId: msg.id,
		ticketId: ticket.id,
		contactId: msg.fromMe ? undefined : contact.id,
		body: msg.id,
		fromMe: msg.fromMe,
		read: msg.fromMe,
		mediaUrl: msg.id,
		mediaType: msg.mimetype.split("/")[0],
		quotedMsgId: quotedMsg?.id,
		timestamp: msg.timestamp,
		status: msg.fromMe ? "sended" : "received",
	};

	await ticket.update({
		lastMessage: msg.id,
		lastMessageAt: new Date().getTime(),
		answered: msg.fromMe || false,
	});
	const newMessage = await CreateMessageService({
		messageData,
		tenantId: ticket.tenantId,
	});

	return newMessage;
};

export default VerifyMediaMessage;
