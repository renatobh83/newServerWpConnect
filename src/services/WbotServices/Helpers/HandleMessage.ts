import type { Contact, Message, Whatsapp } from "@wppconnect-team/wppconnect";
import { isValidMsg } from "./IsValidMsg";
import { VerifyMediaMessage } from "./VerifyMediaMessage";

interface Session extends Whatsapp {
	id: number;
}

export const HandleMessage = async (
	msg: Message,
	wbot: Session,
): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!isValidMsg(msg)) {
				return;
			}
			let msgContact: Contact;
			let groupContact: Contact | undefined;
			const chat = await wbot.getChatById(msg.to);

			if (msg.fromMe) {
				if (!msg.isMedia && msg.type !== "chat" && msg.type !== "vcard") return;
				msgContact = await wbot.getContact(msg.to);
			} else {
				msgContact = msg.sender;
			}
			if (msg.isGroupMsg) {
				let msgGroupContact;

				if (msg.fromMe) {
					msgGroupContact = await wbot.getContact(msg.to);
				} else {
					msgGroupContact = await wbot.getContact(msg.from);
				}
				// groupContact = await VerifyContact(msgGroupContact, tenantId);
			}

			const unreadMessages = msg.fromMe ? 0 : chat.unreadCount;

			// await VerifyMediaMessage(msg, msgContact)

			resolve();
		} catch (error) {
			reject(error);
		}
	});
};
