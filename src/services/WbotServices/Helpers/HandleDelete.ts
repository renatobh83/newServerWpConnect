import socketEmit from "../../../helpers/socketEmit";
import Message from "../../../models/Message";
import Ticket from "../../../models/Ticket";
import { logger } from "../../../utils/logger";

export const HandleMsgDelete = (msg) => {
	// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
	return new Promise<void>(async (resolve, reject) => {
		try {
			const messageData = msg;
			if (messageData._data) {
				const searchCondition = {
					messageId: messageData.id,
				};

				const message = await Message.findOne({
					where: searchCondition,
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

				if (message) {
					const { ticket } = message;
					const updateData = { isDeleted: true };
					await message.update(updateData);

					socketEmit({
						tenantId: ticket.tenantId,
						type: "chat:update",
						payload: message,
					});
				}
				resolve();
			} else {
				logger.info("ProtocolMessageKey não está presente no objeto msg");
			}
		} catch (error) {
			reject(error);
		}
	});
};
