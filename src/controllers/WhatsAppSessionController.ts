import type { Request, RequestHandler, Response } from "express";
import AppError from "../errors/AppError";
import { getIO } from "../libs/scoket";
import { getWbot } from "../libs/wbot";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";
import * as logger from "../utils/logger";

const store: RequestHandler = async (req: Request, res: Response) => {
	const { whatsappId } = req.params;
	const { tenantId } = req.user;
	const whatsapp = await ShowWhatsAppService({
		id: whatsappId,
		tenantId,
		isInternal: true,
	});

	StartWhatsAppSession(whatsapp);

	res.status(200).json({ message: "Starting session." });
};

const update: RequestHandler = async (req: Request, res: Response) => {
	const { whatsappId } = req.params;
	const { isQrcode } = req.body;
	const { tenantId } = req.user;

	if (isQrcode) {
		// await apagarPastaSessao(whatsappId);
	}

	const { whatsapp } = await UpdateWhatsAppService({
		whatsappId,
		whatsappData: { session: "" },
		tenantId,
	});

	// await apagarPastaSessao(whatsappId);
	StartWhatsAppSession(whatsapp);
	res.status(200).json({ message: "Starting session." });
};

const remove: RequestHandler = async (req: Request, res: Response) => {
	const { whatsappId } = req.params;
	const { tenantId } = req.user;
	const channel = await ShowWhatsAppService({ id: whatsappId, tenantId });

	const io = getIO();

	try {
		if (channel.type === "whatsapp") {
			const wbot = getWbot(channel.id);
			// await setValue(`${channel.id}-retryQrCode`, 0);
			await wbot
				.logout()
				.catch((error) =>
					logger.logger.error("Erro ao fazer logout da conexão", error),
				); // --> fecha o client e conserva a sessão para reconexão (criar função desconectar)
			// removeWbot(channel.id);

			// await apagarPastaSessao(whatsappId);
			// await wbot
			//   .destroy()
			//   .catch(error => logger.error("Erro ao destuir conexão", error)); // --> encerra a sessão e desconecta o bot do whatsapp, geando um novo QRCODE
		}

		// if (channel.type === "telegram") {
		//   const tbot = getTbot(channel.id);
		//   await tbot.telegram
		//     .logOut()
		//     .catch(error => logger.error("Erro ao fazer logout da conexão", error));
		//   removeTbot(channel.id);
		// }

		// if (channel.type === "instagram") {
		//   const instaBot = getInstaBot(channel.id);
		//   await instaBot.destroy();
		//   removeInstaBot(channel);
		// }

		await channel.update({
			status: "DISCONNECTED",
			session: "",
			qrcode: undefined,
			retries: 0,
		});
	} catch (error) {
		logger.logger.error(error);
		await channel.update({
			status: "DISCONNECTED",
			session: "",
			qrcode: undefined,
			retries: 0,
		});

		io.emit(`${channel.tenantId}:whatsappSession`, {
			action: "update",
			session: channel,
		});
		throw new AppError("ERR_NO_WAPP_FOUND", 404);
	}
	res.status(200).json({ message: "Session disconnected." });
};

export default { store, remove, update };
