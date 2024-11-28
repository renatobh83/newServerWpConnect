// import AppError from "../../errors/AppError";
// import socketEmit from "../../helpers/socketEmit";
import LogTicket from "../../models/LogTicket";

type LogType =
	| "access"
	| "create"
	| "closed"
	| "transfered"
	| "receivedTransfer"
	| "open"
	| "pending"
	| "queue"
	| "userDefine"
	| "delete"
	| "chatBot"
	| "autoClose"
	| "retriesLimitQueue"
	| "retriesLimitUserDefine";

interface Request {
	type: LogType;
	ticketId: number;
	userId?: number;
	queueId?: number;
}

const CreateLogTicketService = async ({
	type,
	userId,
	ticketId,
	queueId,
}: Request): Promise<void> => {
	await LogTicket.create({
		userId,
		ticketId,
		type,
		queueId,
	});

	// socketEmit({
	//   tenantId,
	//   type: "ticket:update",
	//   payload: ticket
	// });
};

export default CreateLogTicketService;
