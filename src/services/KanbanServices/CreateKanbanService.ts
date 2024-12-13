import { sign } from "jsonwebtoken";
import auth from "../../config/auth";
import Kanban from "../../models/Kanban";

export const createKanbanService = async ({ name, tenantId }) => {
	const { secret } = auth;
	const payload = {
		tenantId: tenantId,
		profile: "admin",
	};
	const options = { expiresIn: "730d" };
	const token = sign(payload, secret, options);
	const kanbanData = {
		name: name,
		token: token,
		tenantId: tenantId,
	};
	const kanban = await Kanban.create(kanbanData);
	return kanban;
};
