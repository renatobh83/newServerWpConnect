import AppError from "../../errors/AppError";
import FarewellMessage from "../../models/FarewellMessage";

export const DeleteAllFarewellMessagesService = async (tenantId) => {
	const searchCondition = { tenantId: tenantId };
	const queryOptions = { where: searchCondition };
	const farewellMessages = await FarewellMessage.findAll(queryOptions);

	if (!farewellMessages || farewellMessages.length === 0) {
		throw new AppError("ERR_NO_FAREWELL_MESSAGES_FOUND", 404);
	}

	for (const message of farewellMessages) {
		await message.destroy();
	}
};
