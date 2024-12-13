import AppError from "../../errors/AppError";
import FarewellMessage from "../../models/FarewellMessage";

export const ShowFarewellMessageService = async (id) => {
	const farewellMessage = await FarewellMessage.findByPk(id);

	if (!farewellMessage) {
		throw new AppError("ERR_NO_FAREWELL_MESSAGE_FOUND", 404);
	}

	return farewellMessage;
};
