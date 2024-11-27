import type { Ack } from "@wppconnect-team/wppconnect";
import socketEmit from "../../../helpers/socketEmit";
import ApiMessage from "../../../models/ApiMessage";
import CampaignContacts from "../../../models/CampaignContacts";
import Message from "../../../models/Message";
import Ticket from "../../../models/Ticket";
import { logger } from "../../../utils/logger";
import { getId } from "../../../utils/normalize";

const HandleMsgAck = async (msg: Ack) => {
	await new Promise((r) => setTimeout(r, 500));

	try {
		const messageToUpdate = await Message.findOne({
			where: { messageId: getId(msg) },
			include: [
				"contact",
				{
					model: Ticket,
					as: "ticket",
					attributes: ["id", "tenantId", "apiConfig"],
				},
				{
					model: Message,
					as: "quotedMsg",
					include: ["contact"],
				},
			],
		});

		const ack = msg.ack;
		if (messageToUpdate) {
			await messageToUpdate.update({ ack });
			const { ticket } = messageToUpdate;
			socketEmit({
				tenantId: ticket.tenantId,
				type: "chat:ack",
				payload: messageToUpdate,
			});

			const apiConfig: any = ticket.apiConfig || {};
			if (apiConfig?.externalKey && apiConfig?.urlMessageStatus) {
				const payload = {
					ack,
					messageId: getId(msg),
					ticketId: ticket.id,
					externalKey: apiConfig?.externalKey,
					authToken: apiConfig?.authToken,
					type: "hookMessageStatus",
				};
				// Queue.add("WebHooksAPI", {
				// 	url: apiConfig.urlMessageStatus,
				// 	type: payload.type,
				// 	payload,
				// });
			}
		}

		const messageAPI = await ApiMessage.findOne({
			where: { messageId: getId(msg) },
		});

		if (messageAPI) {
			await messageAPI.update({ ack });
		}

		const messageCampaign = await CampaignContacts.findOne({
			where: { messageId: getId(msg) },
		});

		if (messageCampaign) {
			await messageCampaign.update({ ack });
		}
	} catch (err) {
		logger.error(err);
	}
};

export default HandleMsgAck;
