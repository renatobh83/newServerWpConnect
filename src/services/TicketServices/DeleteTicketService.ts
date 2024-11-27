import AppError from "../../errors/AppError";
import type Ticket from "../../models/Ticket";
import CreateLogTicketService from "./CreateLogTicketService";
import ShowTicketService from "./ShowTicketService";

interface Request {
	id: string | number;
	tenantId: number;
	userId: number;
}

const DeleteTicketService = async ({
	id,
	tenantId,
	userId,
}: Request): Promise<Ticket> => {
	const ticket = await ShowTicketService({ id, tenantId });

	if (!ticket) {
		throw new AppError("ERR_NO_TICKET_FOUND", 404);
	}

	// await ticket.destroy();

	await CreateLogTicketService({
		userId,
		ticketId: ticket.id,
		type: "delete",
	});

	return ticket;
};

export default DeleteTicketService;
