import type {
	Chat,
	Message,
	ProfilePicThumbObj,
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
import { addJob } from "../../../libs/Queue";

import { isApiMessageExistsService } from "../../ApiMessageServices/isApiMessageExistsService";
import { isConfirmacaoMessageExistsService } from "../../ApiConfirmacaoServices/isConfirmacaoMessageExistsService";
import { invalidResponseConfirmacaoService } from "../../ApiConfirmacaoServices/invalidResponseConfirmacaoService";

interface Session extends Whatsapp {
	id: number;
}
interface MessageFile extends Message {
	filename: string
}
const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
export const HandleMessage = (msg: MessageFile, wbot: Session): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		try {

			const whatsapp = await ShowWhatsAppService({ id: wbot.id });

			const { tenantId } = whatsapp;

			if (await isApiMessageExistsService(msg)) {
				return
			}

			if (!isValidMsg(msg)) {
				return;
			}

			if (await isConfirmacaoMessageExistsService(msg, tenantId)) {
				await invalidResponseConfirmacaoService(msg, wbot, tenantId)
				return
			}

			await delay(600);
			let msgContact: any;
			let groupContact: Contact | undefined;

			const chat: Chat = await wbot.getChatById(msg.to);

			const Settingdb = await Setting.findOne({
				where: { key: "ignoreGroupMsg", tenantId },
			});

			if (
				Settingdb?.value === "enabled" &&
				(msg.isGroupMsg || msg.from === "status@broadcast")
			) {
				return;
			}
			if (msg.fromMe) {
				if (!msg.filehash && msg.type !== "chat" && msg.type !== "vcard")
					return;
				msgContact = await wbot.getContact(msg.to);
			} else {
				msgContact = msg.sender;
			}

			if (!msgContact) {
				const wid = await wbot.checkNumberStatus(msg.to)
				if (wid.canReceiveMessage === false) {
					return
				}
				msgContact = {
					id: wid.id,
					name: wid.id.user,
					isUser: !wid.isBusiness,
					isWAContact: true,

				}
			}



			const profilePicUrl: ProfilePicThumbObj | undefined =
				await wbot.getProfilePicFromServer(getId(msgContact));
			if (msg.isGroupMsg) {
				let msgGroupContact: any;

				if (msg.fromMe) {
					msgGroupContact = await wbot.getContact(msg.to);
				} else {
					msgGroupContact = await wbot.getContact(msg.from);
				}
				if (!msgGroupContact) {
					const wid = await wbot.checkNumberStatus(msg.to)
					if (wid.canReceiveMessage === false) {
						return
					}
					msgGroupContact = {
						id: wid.id,
						name: wid.id.user,
						isUser: !wid.isBusiness,
						isWAContact: true,

					}
				}
				groupContact = (await VerifyContact(
					msgGroupContact,
					tenantId,
					profilePicUrl,
				)) as unknown as Contact;
			}
			const unreadMessages = msg.fromMe ? 0 : chat.unreadCount + 1;
			const contact = await VerifyContact(msgContact, tenantId, profilePicUrl);

			const ticket = await FindOrCreateTicketService({
				contact,
				whatsappId: wbot.id!,
				unreadMessages,
				tenantId,
				groupContact,
				msg,
				channel: "whatsapp",
			});
			if (ticket?.isCampaignMessage) {

				return;
			}

			if (ticket?.isFarewellMessage) {

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
				const payload = {
					timestamp: Date.now(),
					msg,
					messageId: msg.id,
					ticketId: ticket.id,
					externalKey: apiConfig?.externalKey,
					authToken: apiConfig?.authToken,
					type: "hookMessage",
				};
				addJob("WebHooksAPI", {
					url: apiConfig.urlMessageStatus,
					type: payload.type,
					payload,
				});
			}

			resolve();
		} catch (error) {
			reject(error);
		}
	});
};
