import AppError from "../../errors/AppError";
import Queue from "../../models/Queue";

interface Request {
	id: string;
	tenantId: number;
}

const DeleteQueueService = async ({ id, tenantId }: Request): Promise<void> => {
	const queue = await Queue.findOne({
		where: { id, tenantId },
	});

	if (!queue) {
		throw new AppError("ERR_NO_QUEUE_FOUND", 404);
	}
	try {
		await queue.destroy();
	} catch (error) {
		throw new AppError("ERR_QUEUE_TICKET_EXISTS", 404);
	}
};

export default DeleteQueueService;
