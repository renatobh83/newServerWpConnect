import type {
	Message,
	ProfilePicThumbObj,
	Contact as WbotContact,
	Whatsapp,
} from "@wppconnect-team/wppconnect";
import type Contact from "../../../models/Contact";
import Setting from "../../../models/Setting";
import { getId } from "../../../utils/normalize";
import VerifyStepsChatFlowTicket from "../../ChatFlowServices/VerifyStepsChatFlowTicket";
import FindOrCreateTicketService from "../../TicketServices/FindOrCreateTicketService";
import ShowWhatsAppService from "../../WhatsappService/ShowWhatsAppService";
import { isValidMsg } from "./IsValidMsg";
import verifyBusinessHours from "./VerifyBusinessHours";
import VerifyContact from "./VerifyContact";
import VerifyMediaMessage from "./VerifyMediaMessage";
import VerifyMessage from "./VerifyMessage";

interface Session extends Whatsapp {
	id: number;
}

export const HandleMessage = async (
	msg: Message,
	wbot: Session,
): Promise<void> => {
	// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
	return new Promise(async (resolve, reject) => {
		try {
			if (!isValidMsg(msg)) {
				return;
			}
			const whatsapp = await ShowWhatsAppService({ id: wbot.id });

			const { tenantId } = whatsapp;
			let msgContact: WbotContact;
			let groupContact: Contact | undefined;

			const chat = await wbot.getChatById(msg.to);

			const Settingdb = await Setting.findOne({
				where: { key: "ignoreGroupMsg", tenantId },
			});
			if (
				Settingdb?.value === "enabled" &&
				(chat.isGroup || msg.from === "status@broadcast")
			) {
				return;
			}
			if (msg.fromMe) {
				if (!msg.isMedia && msg.type !== "chat" && msg.type !== "vcard") return;
				msgContact = await wbot.getContact(msg.to);
			} else {
				msgContact = msg.sender;
			}
			const profilePicUrl: ProfilePicThumbObj | undefined =
				await wbot.getProfilePicFromServer(getId(msgContact));
			if (msg.isGroupMsg) {
				let msgGroupContact: WbotContact;

				if (msg.fromMe) {
					msgGroupContact = await wbot.getContact(msg.to);
				} else {
					msgGroupContact = await wbot.getContact(msg.from);
				}
				groupContact = (await VerifyContact(
					msgGroupContact,
					tenantId,
					profilePicUrl,
				)) as unknown as Contact;
			}
			const unreadMessages = msg.fromMe ? 0 : chat.unreadCount;
			const contact = await VerifyContact(msgContact, tenantId, profilePicUrl);

			const ticket = await FindOrCreateTicketService({
				contact,
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				whatsappId: wbot.id!,
				unreadMessages,
				tenantId,
				groupContact,
				msg,
				channel: "whatsapp",
			});

			if (ticket?.isConfirmacaoMessage && !msg.fromMe) {
				// await CheckResponseConfirmacao({ data: msg, tenantId });
				resolve();
				return;
			}
			if (ticket?.isConfirmacaoMessage) {
				resolve();
				return;
			}
			if (ticket?.isCampaignMessage) {
				resolve();
				return;
			}

			if (ticket?.isFarewellMessage) {
				resolve();
				return;
			}

			if (msg.filehash) {
				await VerifyMediaMessage(msg, ticket, contact, wbot);
			} else {
				await VerifyMessage(msg, ticket, contact);
			}
			const isBusinessHours = await verifyBusinessHours(msg, ticket);

			if (isBusinessHours) await VerifyStepsChatFlowTicket(msg, ticket);
			const apiConfig: any = ticket.apiConfig || {};
			if (
				!msg.fromMe &&
				!ticket.isGroup &&
				!ticket.answered &&
				apiConfig?.externalKey &&
				apiConfig?.urlMessageStatus
			) {
				// const payload = {
				// 	timestamp: Date.now(),
				// 	msg,
				// 	messageId: msg.id.id,
				// 	ticketId: ticket.id,
				// 	externalKey: apiConfig?.externalKey,
				// 	authToken: apiConfig?.authToken,
				// 	type: "hookMessage",
				// };
				//   Queue.add("WebHooksAPI", {
				// 	url: apiConfig.urlMessageStatus,
				// 	type: payload.type,
				// 	payload,
				//   });
			}

			resolve();
		} catch (error) {
			reject(error);
		}
	});
};
