import socketEmit from '../../../helpers/socketEmit';
import Message from '../../../models/Message';
import Ticket from '../../../models/Ticket';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function HandleMsgReaction(msg: any) {
	try {
		const messageToUpdate = await Message.findOne({
			where: { messageId: msg.msgId._serialized },
			include: [
				'contact',
				{
					model: Ticket,
					as: 'ticket',
					attributes: ['id', 'tenantId', 'apiConfig'],
				},
				{
					model: Message,
					as: 'quotedMsg',
					include: ['contact'],
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
					type: 'chat:update',
					payload: messageToUpdate,
				});
			}
			if (!msg.id.fromMe) {
				const updateData = { reaction: msg.reactionText };
				await messageToUpdate.update(updateData);
				socketEmit({
					tenantId: ticket.tenantId,
					type: 'chat:update',
					payload: messageToUpdate,
				});
			}
		}
	} catch (_error) {}
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
