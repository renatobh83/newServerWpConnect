import type Message from "../models/Message";
import type Ticket from "../models/Ticket";

const SerializeWbotMsgId = (ticket: Ticket, message: Message): string => {
	const serializedMsgId = `${message.fromMe}_${ticket.contact.number}@${
		ticket.isGroup ? "g" : "c"
	}.us_${message.messageId}`;

	return serializedMsgId;
};

export default SerializeWbotMsgId;
