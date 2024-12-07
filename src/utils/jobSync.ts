import { addJob, getJobByName } from "../libs/Queue";
const {
	isAfter,
	isBefore,

	setHours,
	setMinutes,
	setSeconds,

	getDay,
} = require("date-fns");

// Função para adicionar o job dinamicamente
const addJobInterval = async () => {
	const now = new Date();
	const startTime = setSeconds(setMinutes(setHours(now, 7), 0), 0); // 07:00:00
	const endTime = setSeconds(setMinutes(setHours(now, 23), 0), 0); // 20:00:00
	const currentDay = getDay(now); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

	// Verifica se está no horário e dia útil (segunda a sexta)
	if (
		isAfter(now, startTime) &&
		isBefore(now, endTime) &&
		currentDay >= 1 &&
		currentDay <= 5
	) {
		await addJob("VerifyTicketsChatBotInactives", {});
		await addJob("SendMessageSchenduled", {});
	}
};

// Função para remover o job dinamicamente
const removeJob = async () => {
	const now = new Date();
	const startTime = setSeconds(setMinutes(setHours(now, 7), 0), 0); // 07:00:00
	const endTime = setSeconds(setMinutes(setHours(now, 23), 0), 0); // 20:00:00
	const currentDay = getDay(now); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

	// Verifica se está fora do horário ou em finais de semana
	if (
		!(
			isAfter(now, startTime) &&
			isBefore(now, endTime) &&
			currentDay >= 1 &&
			currentDay <= 5
		)
	) {
		await getJobByName("VerifyTicketsChatBotInactives");
		await getJobByName("SendMessageSchenduled");
	}
};

// Intervalo para verificar a lógica
setInterval(async () => {
	await addJobInterval();
	await removeJob();
}, 60 * 1000); // Verifica a cada minuto
