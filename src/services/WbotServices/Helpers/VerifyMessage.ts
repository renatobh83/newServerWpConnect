import type { Message as WbotMessage } from "@wppconnect-team/wppconnect";
import type Contact from "../../../models/Contact";
import type Ticket from "../../../models/Ticket";
import CreateMessageService from "../../MessageServices/CreateMessageService";
import VerifyQuotedMessage from "./VerifyQuotedMessage";

const VerifyMessage = async (
	msg: WbotMessage,
	ticket: Ticket,
	contact: Contact,
) => {
	const quotedMsg = await VerifyQuotedMessage(msg);

	const messageData = {
		messageId: msg.id,
		ticketId: ticket.id,
		contactId: msg.fromMe ? undefined : contact.id,
		body: msg.content,
		fromMe: msg.fromMe,
		mediaType: msg.type,
		read: msg.fromMe,
		quotedMsgId: quotedMsg?.id,
		timestamp: msg.timestamp,
		status: "received",
	};

	await ticket.update({
		lastMessage: msg.content,
		lastMessageAt: new Date().getTime(),
		answered: msg.fromMe || false,
	});
	await CreateMessageService({ messageData, tenantId: ticket.tenantId });
};

export default VerifyMessage;
