import fs from "node:fs";
import type { Message as WbotMessage } from "@wppconnect-team/wppconnect";
import { getWbot } from "../libs/wbot";
import CreateMessageSystemService from "../services/MessageServices/CreateMessageSystemService";
import FindOrCreateTicketService from "../services/TicketServices/FindOrCreateTicketService";

// import mime from "mime-types";
import { logger } from "../utils/logger";
import { getNumberId } from "../utils/wbot/getNumberId";
import VerifyContact from "../services/WbotServices/Helpers/VerifyContact";
import { addJob } from "../libs/Queue";

export default {
	key: "SendMessageAPI",
	options: {
		delay: 6000,
		attempts: 50,
		removeOnComplete: true,
		removeOnFail: false,
		backoff: {
			type: "fixed",
			delay: 60000 * 3, // 3 min
		},
	},
	async handle( data : any) {
		try {
			const wbot = getWbot(data.sessionId);


				const message: any = {} as WbotMessage;
				try {

					const idNumber = getNumberId(data.number)

					if (!idNumber) {
						const payload = {
							ack: -1,
							body: data.body,
							messageId: "",
							number: data.number,
							externalKey: data.externalKey,
							error: "number invalid in whatsapp",
							type: "hookMessageStatus",
							authToken: data.authToken,
						};
						if (data.media) {
							// excluir o arquivo se o número não existir
							fs.unlinkSync(data.media.path);
						}
						if (data?.apiConfig?.urlMessageStatus) {
							addJob("WebHooksAPI", {
								url: data.apiConfig.urlMessageStatus,
								type: payload.type,
								payload,
							});
						}
						return payload;
					}
					// '559891191708@c.us'
					const msgContact = await wbot.getContact(idNumber);
					const contact = await VerifyContact(msgContact, data.tenantId);

					const ticket = await FindOrCreateTicketService({
						contact,
						whatsappId: wbot.id!,
						unreadMessages: 0,
						tenantId: data.tenantId,
						groupContact: undefined,
						msg: data,
						channel: "whatsapp",
					});
					await CreateMessageSystemService({
						msg: data,
						tenantId: data.tenantId,
						ticket,
						sendType: "API",
						status: "pending",
					});
					await ticket.update({
						apiConfig: {
							...data.apiConfig,
							externalKey: data.externalKey,
						},
					});
				} catch (error) {
					const payload = {
						ack: -2,
						body: data.body,
						messageId: "",
						number: data.number,
						externalKey: data.externalKey,
						error: "error session",
						type: "hookMessageStatus",
						authToken: data.authToken,
					};
					console.log(payload)
					if (data?.apiConfig?.urlMessageStatus) {
						addJob("WebHooksAPI", {
							url: data.apiConfig.urlMessageStatus,
							type: payload.type,
							payload,
						});
					}
					throw new Error(error);
				}
			// const apiMessage = await UpsertMessageAPIService({
			//   sessionId: data.sessionId,
			//   messageId: message.id.id,
			//   body: data.body,
			//   ack: message.ack,
			//   number: data.number,
			//   mediaName: data?.media?.filename,
			//   mediaUrl: data.mediaUrl,
			//   timestamp: message.timestamp,
			//   externalKey: data.externalKey,
			//   messageWA: message,
			//   apiConfig: data.apiConfig,
			//   tenantId: data.tenantId
			// });
		} catch (error) {
			logger.error({ message: "Error send message api", error });
			throw new Error(error);
		}
	},
};
