import AppError from "../../errors/AppError";
import Kanban from "../../models/Kanban";

export const deleteKanbanConfigService = async ({ kanbanId, tenantId }) => {
	const kanbanFilter = {
		id: kanbanId,
		tenantId: tenantId,
	};
	const findOneOptions = { where: kanbanFilter };
	const kanban = await Kanban.findOne(findOneOptions);

	if (!kanban) {
		throw new AppError("ERR_KANBAN_CONFIG_NOT_FOUND", 404);
	}

	await kanban.destroy();
};
