import { writeFile } from "node:fs";

import { promisify } from "node:util";
import AppError from "../../errors/AppError";
import ChatFlow from "../../models/ChatFlow";
const writeFileAsync = promisify(writeFile);

interface Request {
	id: string | number;
	tenantId: string | number;
}

const DeleteChatFlowService = async ({
	id,
	tenantId,
}: Request): Promise<void> => {
	const cahtFlow = await ChatFlow.findOne({
		where: { id, tenantId },
	});

	if (!cahtFlow) {
		throw new AppError("ERR_NO_CHAT_FLOW_FOUND", 404);
	}

	await cahtFlow.update({
		isActive: false,
		isDeleted: true,
	});

	await cahtFlow.reload({
		attributes: ["isActive", "isDeleted"],
	});
};

export default DeleteChatFlowService;
