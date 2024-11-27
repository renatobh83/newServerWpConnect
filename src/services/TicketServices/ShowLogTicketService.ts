import LogTicket from "../../models/LogTicket";
import Queue from "../../models/Queue";
import User from "../../models/User";

interface Request {
	ticketId: string | number;
}

const ShowLogTicketService = async ({
	ticketId,
}: Request): Promise<LogTicket[]> => {
	const logs = await LogTicket.findAll({
		where: {
			ticketId,
		},
		include: [
			{
				model: User,
				as: "user",
				attributes: ["id", "name"],
			},
			{
				model: Queue,
				as: "queue",
				attributes: ["id", "queue"],
			},
		],
		order: [["createdAt", "DESC"]],
	});

	return logs;
};

export default ShowLogTicketService;
