/* eslint-disable @typescript-eslint/no-explicit-any */
import { join } from "node:path";
import type { Message as WbotMessage } from "@wppconnect-team/wppconnect";
import { getWbot } from "../libs/wbot";
import CampaignContacts from "../models/CampaignContacts";
import { logger } from "../utils/logger";

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
	async handle(data: any[]) {
		try {
			// biome-ignore lint/complexity/noForEach: <explanation>
			data.forEach(async (value) => {
				/// feito por está apresentando problema com o tipo
				const wbot = getWbot(value.whatsappId);
				let messageSent = {} as WbotMessage;
				if (value.mediaUrl) {
					const customPath = join(__dirname, "..", "..", "public");
					const mediaPath = join(customPath, value.mediaName);

					messageSent = await wbot.sendFile(`${value.number}@c.us`, mediaPath, {
						caption: value.message,
					});
				} else {
					messageSent = await wbot.sendText(
						`${value.number}@c.us`,
						value.message,
						{
							linkPreview: false,
						},
					);
				}

				await CampaignContacts.update(
					{
						messageId: messageSent.id,
						messageRandom: value.messageRandom,
						body: value.message,
						mediaName: value.mediaName,
						timestamp: value.message.timestamp,
						//   jobId: data.jobId
						ack: messageSent.ack,
					},
					{ where: { id: value.campaignContact.id } },
				);

				return messageSent;
			});
		} catch (error) {
			logger.error(`Error enviar message campaign: ${error}`);
			throw new Error(error);
		}
	},
};
