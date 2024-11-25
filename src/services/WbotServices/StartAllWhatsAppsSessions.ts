import { Op } from "sequelize";
import Whatsapp from "../../models/Whatsapp";
import { StartWhatsAppSession } from "./StartWhatsAppSession";

export const StartAllWhatsAppsSessions = async (): Promise<void> => {
	const whatsapps = await Whatsapp.findAll({
		where: {
			[Op.or]: [
				{
					[Op.and]: {
						type: {
							[Op.in]: ["instagram", "telegram", "waba", "messenger"],
						},
						status: {
							[Op.notIn]: ["DISCONNECTED"],
						},
					},
				},
				{
					[Op.and]: {
						type: "whatsapp",
					},
					status: {
						[Op.notIn]: ["DISCONNECTED", "qrcode"],
						// "DISCONNECTED"
					},
				},
			],
			isActive: true,
		},
	});

	const whatsappSessions = whatsapps.filter((w) => w.type === "whatsapp");
	if (whatsappSessions.length > 0) {
		// biome-ignore lint/complexity/noForEach: <explanation>
		whatsappSessions.forEach((whatsapp: Whatsapp) => {
			StartWhatsAppSession(whatsapp);
		});
	}
};
