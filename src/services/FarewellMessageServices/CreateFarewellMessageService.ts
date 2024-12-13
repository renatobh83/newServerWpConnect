import AppError from "../../errors/AppError";
import FarewellMessage from "../../models/FarewellMessage";

export const CreateFarewellMessageService = async ({
	groupId,
	message,
	userId,
	tenantId,
}) => {
	const searchCondition = {
		groupId: groupId,
		message: message,
		userId: userId,
		tenantId: tenantId,
	};
	const queryOptions = { where: searchCondition };
	const existingMessage = await FarewellMessage.findOne(queryOptions);

	if (existingMessage) {
		throw new AppError("ERR_FAREWELL_MESSAGE_DUPLICATED");
	}

	const newMessageData = {
		groupId: groupId,
		message: message,
		userId: userId,
		tenantId: tenantId,
	};
	const newMessage = await FarewellMessage.create(newMessageData);
	return newMessage;
};
