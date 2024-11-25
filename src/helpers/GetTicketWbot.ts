import type { Whatsapp } from "@wppconnect-team/wppconnect";
import { getWbot } from "../libs/wbot";
import type Confirmacao from "../models/Confirmacao";
import type Ticket from "../models/Ticket";
import GetDefaultWhatsApp from "./GetDefaultWhatsApp";

const GetTicketWbot = async (
	ticket: Ticket | Confirmacao,
): Promise<Whatsapp> => {
	if (!ticket.whatsappId) {
		const defaultWhatsapp = await GetDefaultWhatsApp(ticket.tenantId);

		await ticket.$set("whatsapp", defaultWhatsapp);
	}

	const wbot = getWbot(ticket.whatsappId);

	return wbot;
};

export default GetTicketWbot;
