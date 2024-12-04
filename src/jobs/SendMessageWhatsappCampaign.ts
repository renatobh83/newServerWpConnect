import { join } from "node:path";
import type { Message as WbotMessage } from "@wppconnect-team/wppconnect";
import { getWbot } from "../libs/wbot";
import CampaignContacts from "../models/CampaignContacts";
import { logger } from "../utils/logger";
import socketEmit from "../helpers/socketEmit";

export default {
	key: "SendMessageWhatsappCampaign",
	options: {
		delay: 15000,
		attempts: 10,
		removeOnComplete: true,
		// removeOnFail: true,
		backoff: {
			type: "fixed",
			delay: 60000 * 5, // 5 min
		},
	},
	async handle(data: any): Promise<void> {
		try {
			const wbot = getWbot(data.whatsappId);
			let messageSent = {} as WbotMessage;
			if (data.mediaUrl) {
				const customPath = join(__dirname, "..", "..", "public");
				const mediaPath = join(customPath, data.mediaName);

				messageSent = await wbot.sendFile(`${data.number}@c.us`, mediaPath, {
					caption: data.message,
				});
			} else {
				messageSent = await wbot.sendText(`${data.number}@c.us`, data.message, {
					linkPreview: false,
				});
			}

			await CampaignContacts.update(
				{
					messageId: messageSent.id,
					messageRandom: data.messageRandom,
					body: data.message,
					mediaName: data.mediaName,
					timestamp: data.message.timestamp,
					//   jobId: data.jobId
					ack: messageSent.ack,
				},
				{ where: { id: data.campaignContact.id } },
			);

			socketEmit({
				tenantId: data.tenantId,
				type: "campaign:send",
				payload: {},
			});
		} catch (error) {
			logger.error(`Error enviar message campaign: ${error}`);
			throw new Error(error);
		}
	},
};
