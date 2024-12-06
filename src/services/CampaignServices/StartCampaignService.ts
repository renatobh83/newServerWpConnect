import type { JobOptions } from "bull";
import {
	addDays,
	addHours,
	addSeconds,
	differenceInDays,
	differenceInSeconds,
	format,
	getDay,
	isAfter,
	isBefore,
	isWeekend,
	isWithinInterval,
	parse,
	parseISO,
	setHours,
	setMinutes,
	startOfDay,
} from "date-fns";

import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import AppError from "../../errors/AppError";
import socketEmit from "../../helpers/socketEmit";
import Campaign from "../../models/Campaign";
import CampaignContacts from "../../models/CampaignContacts";
import Queue, { addJob } from "../../libs/Queue";

interface Request {
	campaignId: string | number;
	tenantId: number | string;
	// eslint-disable-next-line @typescript-eslint/ban-types
	options?: JobOptions;
}

// const isValidDate = (date: Date) => {
//   return (
//     startOfDay(new Date(date)).getTime() >= startOfDay(new Date()).getTime()
//   );
// };

const cArquivoName = (url: string | null) => {
	if (!url) return "";
	const split = url.split("/");
	const name = split[split.length - 1];
	return name;
};

const randomInteger = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const mountMessageData = (
	campaign: Campaign,
	campaignContact: CampaignContacts,
	// eslint-disable-next-line @typescript-eslint/ban-types
	options: object | undefined,
) => {
	const messageRandom = randomInteger(1, 3);
	let bodyMessage = "";
	if (messageRandom === 1) bodyMessage = campaign.message1;
	if (messageRandom === 2) bodyMessage = campaign.message2;
	if (messageRandom === 3) bodyMessage = campaign.message3;

	return {
		whatsappId: campaign.sessionId,
		message: bodyMessage,
		number: campaignContact.contact.number,
		mediaUrl: campaign.mediaUrl,
		mediaName: cArquivoName(campaign.mediaUrl),
		messageRandom: `message${messageRandom}`,
		campaignContact,
		tenantId: campaign.tenantId,
		options,
	};
};

const nextDayHoursValid = (date: Date) => {
	let dateVerify = date;
	const dateNow = new Date();
	const diffDays = differenceInDays(dateVerify, new Date());

	// se dia for menor que o atual
	if (diffDays < 0) {
		dateVerify = addDays(dateVerify, diffDays * -1);
	}

	// se a hora for menor que a atual ao programar a campanha
	if (dateVerify.getTime() < dateNow.getTime()) {
		dateVerify = setMinutes(
			setHours(dateVerify, dateNow.getHours()),
			dateNow.getMinutes(),
		);
	}

	const start = parse("08:00", "HH:mm", dateVerify);
	const end = parse("20:00", "HH:mm", dateVerify);

	let isValidHour = isWithinInterval(dateVerify, { start, end });
	const isDateBefore = isBefore(start, dateVerify);
	const isDateAfter = isAfter(end, dateVerify);

	// fora do intervalo e menor que a hora inicial
	if (!isValidHour && isDateBefore) {
		dateVerify = setMinutes(setHours(dateVerify, 8), 30);
	}

	// fora do intervalo e no mesmo dia
	if (!isValidHour && isDateBefore && diffDays === 0) {
		dateVerify = addDays(dateVerify, diffDays + 1);
	}
	// fora do intervalo, maior que a hora final e no mesmo dia
	if (!isValidHour && isDateAfter && diffDays === 0) {
		dateVerify = addDays(setHours(dateVerify, 8), 1);
	}

	// fora do intervalo, maior que a hora final e dia diferente
	if (!isValidHour && isDateAfter && diffDays > 0) {
		dateVerify = setHours(dateVerify, 8);
	}
	while (isWeekend(dateVerify)) {
		dateVerify = addDays(dateVerify, 1); // Passa para o próximo dia
		if (!isValidHour) {
			dateVerify = setHours(dateVerify, 8); // Define o horário como 08:00
		}
		isValidHour = isWithinInterval(dateVerify, {
			start: parse("08:00", "HH:mm", dateVerify),
			end: parse("20:00", "HH:mm", dateVerify),
		});
	}

	return dateVerify;
};

const calcDelay = (nextDate: Date, delay: number) => {
	const diffSeconds = differenceInSeconds(nextDate, new Date());
	return diffSeconds * 1000 + delay;
};

const StartCampaignService = async ({
	campaignId,
	tenantId,
	options,
}: Request): Promise<void> => {
	const campaign = await Campaign.findOne({
		where: { id: campaignId, tenantId },
		include: ["session"],
	});

	if (!campaign) {
		throw new AppError("ERROR_CAMPAIGN_NOT_EXISTS", 404);
	}

	// if (!isValidDate(campaign.start)) {
	//   throw new AppError("ERROR_CAMPAIGN_DATE_NOT_VALID", 404);
	// }

	const campaignContacts = await CampaignContacts.findAll({
		where: { campaignId },
		include: ["contact"],
	});

	if (!campaignContacts) {
		throw new AppError("ERR_CAMPAIGN_CONTACTS_NOT_EXISTS", 404);
	}
	const startDay = nextDayHoursValid(campaign.start);

	if (startDay !== campaign.start) {
		await campaign.update({ start: startDay });
		socketEmit({
			tenantId,
			type: "campaign:update",
			payload: {},
		});
	}

	const timeDelay = campaign.delay ? campaign.delay * 1000 : 20000;

	let dateDelay = toZonedTime(startDay, "America/Sao_Paulo");

	const data = campaignContacts.map((campaignContact: CampaignContacts) => {
		dateDelay = addSeconds(dateDelay, timeDelay / 1000);

		return mountMessageData(campaign, campaignContact, {
			...options,
			jobId: `campaginId_${campaign.id}_contact_${campaignContact.contactId}_id_${campaignContact.id}`,
			delay: calcDelay(new Date(dateDelay), timeDelay),
		});
	})[0];

	await Queue.add("SendMessageWhatsappCampaign", data);

	await campaign.update({
		status: "scheduled",
	});
};

export default StartCampaignService;
