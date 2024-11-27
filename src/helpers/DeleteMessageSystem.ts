import { differenceInHours } from "date-fns";
import AppError from "../errors/AppError";
import { getIO } from "../libs/scoket";
import Message from "../models/Message";
import Ticket from "../models/Ticket";
import GetWbotMessage from "./GetWbotMessage";

const DeleteMessageSystem = async (
	id: string,
	messageId: string,
	tenantId: string | number,
): Promise<void> => {
	const message = await Message.findOne({
		where: { id },
		include: [
			{
				model: Ticket,
				as: "ticket",
				include: ["contact"],
				where: { tenantId },
			},
		],
	});

	if (message) {
		const diffHoursDate = differenceInHours(new Date(), message?.createdAt);
		if (diffHoursDate > 2) {
			throw new AppError("No delete message afeter 2h sended");
		}
	}

	if (!message) {
		throw new AppError("No message found with this ID.");
	}

	const { ticket } = message;

	if (ticket.channel === "whatsapp") {
		const messageToDelete = await GetWbotMessage(ticket, messageId);
		if (!messageToDelete) {
			throw new AppError("ERROR_NOT_FOUND_MESSAGE");
		}
		await messageToDelete.delete(true);
	}

	await message.update({ isDeleted: true });

	const io = getIO();
	// .to(`tenant:${tenantId}:notification`)
	io.to(`tenant:${tenantId}:${ticket.id}`).emit(
		`tenant:${tenantId}:appMessage`,
		{
			action: "update",
			message,
			ticket,
			contact: ticket.contact,
		},
	);
};

export default DeleteMessageSystem;
