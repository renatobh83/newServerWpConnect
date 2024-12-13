import AppError from "../../errors/AppError";
import FarewellMessage from "../../models/FarewellMessage";

export const DeleteFarewellMessageService = async (id, tenantId) => {
	const searchCondition = {
		id: id,
		tenantId: tenantId,
	};
	const queryOptions = { where: searchCondition };
	const farewellMessage = await FarewellMessage.findOne(queryOptions);

	if (!farewellMessage) {
		throw new AppError("ERR_NO_FAREWELL_MESSAGE_FOUND", 404);
	}

	await farewellMessage.destroy();
};
