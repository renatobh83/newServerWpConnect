import { addJob, getJobByName } from "../libs/Queue";
import {
	isAfter,
	isBefore,
	setHours,
	setMinutes,
	setSeconds,
	getDay,
} from "date-fns";
import { logger } from "./logger";

const jobStatus = {
	VerifyTicketsChatBotInactives: false,
	SendMessageSchenduled: false,
};

export const addJobInterval = async () => {
	const now = new Date();
	const startTime = setSeconds(setMinutes(setHours(now, 5), 0), 0); // 05:00:00
	const endTime = setSeconds(setMinutes(setHours(now, 18), 0), 0); // 19:00:00
	const currentDay = getDay(now); // 0 = Domingo, ..., 6 = Sábado

	if (
		isAfter(now, startTime) &&
		isBefore(now, endTime) &&
		currentDay >= 1 &&
		currentDay <= 5
	) {
		if (!jobStatus.VerifyTicketsChatBotInactives) {

			await addJob("VerifyTicketsChatBotInactives", {});
			jobStatus.VerifyTicketsChatBotInactives = true;
		}

		if (!jobStatus.SendMessageSchenduled) {

			await addJob("SendMessageSchenduled", {});
			jobStatus.SendMessageSchenduled = true;
		}
	}
};

const removeJob = async () => {
	const now = new Date();
	const startTime = setSeconds(setMinutes(setHours(now, 5), 0), 0); // 05:00:00
	const endTime = setSeconds(setMinutes(setHours(now, 18), 0), 0); // 19:00:00
	const currentDay = getDay(now);

	if (
		!(
			isAfter(now, startTime) &&
			isBefore(now, endTime) &&
			currentDay >= 1 &&
			currentDay <= 5
		)
	) {
		if (jobStatus.VerifyTicketsChatBotInactives) {

			await getJobByName("VerifyTicketsChatBotInactives");
			jobStatus.VerifyTicketsChatBotInactives = false;
		}

		if (jobStatus.SendMessageSchenduled) {

			await getJobByName("SendMessageSchenduled");
			jobStatus.SendMessageSchenduled = false;
		}
	}
};

// Intervalo para verificar a lógica
setInterval(async () => {
	try {
		await removeJob();
	} catch (error) {
		logger.error({
			message: "Erro no intervalo de execução de jobs",
			error,
		});
	}
}, 60 * 1000); // Verifica a cada minuto
