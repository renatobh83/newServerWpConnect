import { Op } from "sequelize";
import { getWbot } from "../../../libs/wbot";
import Contact from "../../../models/Contact";
import Whatsapp from "../../../models/Whatsapp";
import { logger } from "../../../utils/logger";
import { pupa } from "../../../utils/pupa";
import CheckIsValidContact from "../CheckIsValidContact";

const checkBirthday = (birthday) => {
	const today = new Date();
	const date = new Date(birthday); // Converte o string do banco em um objeto Date

	// Extrai dia e mês
	const day = date.getUTCDate();
	const month = date.getUTCMonth() + 1;

	// Compara com o dia e mês de hoje
	return today.getDate() === day && today.getMonth() + 1 === month;
};

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
const rndInt = randomIntFromInterval(1, 3);

const timer = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const SendMessageBirthday = async (whatsapp) => {
	let isProcessing = false;

	if (isProcessing) {
		logger.info(
			"Process SendMessageBirthday already running, waiting for completion",
		);
		return;
	}
	isProcessing = true;

	try {
		const whatsappData = { id: whatsapp };
		const whatsappRecord = await Whatsapp.findOne({
			where: whatsappData,
		});

		if (!whatsappRecord) {
			return;
		}

		const contactCondition = { [Op.ne]: null };

		const searchCondition = {
			tenantId: whatsappRecord.tenantId,
			dtaniversario: contactCondition,
		};
		const queryOptions = {
			where: searchCondition,
			attributes: [
				"id",
				"name",
				"number",
				"email",
				"identifier",
				"dtaniversario",
			],
		};
		const contacts = await Contact.findAll(queryOptions);

		const birthdayDateMessage = "{{name}} Feliz aniversário";
		for (const contact of contacts) {
			if (contact.dtaniversario && checkBirthday(contact.dtaniversario)) {
				const message = pupa(birthdayDateMessage || "", {
					name: contact.name || "",
					email: contact.email || "",
					phoneNumber: contact.number || "",
				});

				if (whatsappRecord.type === "whatsapp") {
					const wbot = getWbot(whatsappRecord.id);
					const validContact = await CheckIsValidContact(
						contact.number,
						whatsappRecord.tenantId,
					);

					// biome-ignore lint/complexity/useLiteralKeys: <explanation>
					await wbot.sendText(validContact.id["_serialized"], message);
				}

				await timer(rndInt * 1000);
			}
		}
	} finally {
		isProcessing = false;
	}
};
