import AppError from "../../errors/AppError";
import FarewellMessage from "../../models/FarewellMessage";

export const UpdateFarewellMessageService = async ({
	farewellMessageData,
	farewellMessageId,
}) => {
	const { groupId, message, userId, tenantId } = farewellMessageData;

	const searchCondition = {
		id: farewellMessageId,
		tenantId: tenantId,
	};

	const queryOptions = {
		where: searchCondition,
		attributes: ["id", "groupId", "message", "userId"],
	};

	const farewellMessage = await FarewellMessage.findOne(queryOptions);

	if (!farewellMessage) {
		throw new AppError("ERR_NO_FAREWELL_MESSAGE_FOUND", 404);
	}

	const updateData = {
		groupId: groupId,
		message: message,
		userId: userId,
	};

	await farewellMessage.update(updateData);

	const reloadOptions = { attributes: ["id", "groupId", "message", "userId"] };
	await farewellMessage.reload(reloadOptions);

	return farewellMessage;
};
