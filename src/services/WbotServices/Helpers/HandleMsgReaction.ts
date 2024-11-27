import socketEmit from "../../../helpers/socketEmit";
import Message from "../../../models/Message";
import Ticket from "../../../models/Ticket";
import { logger } from "../../../utils/logger";
import { getId } from "../../../utils/normalize";
import type { MessageReaction } from "../wbotMessageListener";

export async function HandleMsgReaction(msg: MessageReaction) {
	try {
		const messageToUpdate = await Message.findOne({
			where: { messageId: msg.msgId._serialized },
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
		if (messageToUpdate) {
			const { ticket } = messageToUpdate;
			if (msg.id.fromMe) {
				const updateData = { reactionFromMe: msg.reactionText };
				await messageToUpdate.update(updateData);
				socketEmit({
					tenantId: ticket.tenantId,
					type: "chat:update",
					payload: messageToUpdate,
				});
			}
			if (!msg.id.fromMe) {
				const updateData = { reaction: msg.reactionText };
				await messageToUpdate.update(updateData);
				socketEmit({
					tenantId: ticket.tenantId,
					type: "chat:update",
					payload: messageToUpdate,
				});
			}
		}
	} catch (error) {}
	// try {
	// console.log(msg)
	// return
	// 	const messageToUpdate = await Message.findOne({
	// 		where: { messageId: reactionEvent.msgId.id },
	// 		include: [
	// 			"contact",
	// 			{
	// 				model: Ticket,
	// 				as: "ticket",
	// 				attributes: ["id", "tenantId", "apiConfig"],
	// 			},
	// 			{
	// 				model: Message,
	// 				as: "quotedMsg",
	// 				include: ["contact"],
	// 			},
	// 		],
	// 	});
	// 	if (messageToUpdate) {
	// 		const { ticket } = messageToUpdate;
	// 		if (reactionEvent.id.fromMe) {
	// 			const updateData = { reactionFromMe: reactionEvent.reaction };
	// 			yield messageToUpdate.update(updateData);
	// 			socketEmit({
	// 				tenantId: ticket.tenantId,
	// 				type: "chat:update",
	// 				payload: messageToUpdate,
	// 			});
	// 		}
	// 		if (!reactionEvent.id.fromMe) {
	// 			const updateData = { reaction: reactionEvent.reaction };
	// 			yield messageToUpdate.update(updateData);
	// 			socketEmit({
	// 				tenantId: ticket.tenantId,
	// 				type: "chat:update",
	// 				payload: messageToUpdate,
	// 			});
	// 		}
	// 	}
	// } catch (error) {
	// 	logger.error(error);
	// }
}
