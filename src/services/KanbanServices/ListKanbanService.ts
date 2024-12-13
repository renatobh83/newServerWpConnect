import Kanban from "../../models/Kanban";

export const listKanbanService = async ({ tenantId }) => {
	const filter = { tenantId: tenantId };
	const findAllOptions = {
		where: filter,
		order: [["name", "ASC"]],
	};
	const kanban = await Kanban.findAll(findAllOptions);
	const response = { kanban: kanban };
	return response;
};
