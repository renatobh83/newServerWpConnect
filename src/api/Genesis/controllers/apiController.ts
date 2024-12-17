import { NextFunction, Request, RequestHandler, Response } from "express";
import { MensagemConfirmacaoService } from "../services/MensagemConfirmacaoService";
import ProcessBodyData from "../../../helpers/ProcessBodyData";

export const actionsApiGenesis: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { contatos } = req.body;
		const { apiId, authToken, idWbot } = req.params;
		if (contatos && contatos.length > 0) {
			const { notificacao } = contatos[0];

			if (JSON.parse(notificacao).bot) {
				const bot = JSON.parse(notificacao).bot;
				switch (bot) {
					case "agenda":
						await MensagemConfirmacaoService({ apiId, authToken, idWbot, ...req.body })
						break
					default:
						break
				}
			}

		}
		// await MensagemConfirmacaoService({ apiId, authToken, idWbot, ...req.body })
		// const apiConfig = await ApiConfig.findOne({
		// 	where: {
		// 		id: apiId,
		// 		authToken,
		// 	},
		// });

		// if (apiConfig === null) {
		// 	throw new AppError("ERR_SESSION_NOT_AUTH_TOKEN", 403);
		// }

		// const newMessage: MessageDataRequest = {
		// 	externalKey: authToken,
		// 	body: contatos[0],
		// 	apiId,
		// 	sessionId: apiConfig.sessionId,
		// 	tenantId: apiConfig.tenantId,
		// 	apiConfig: apiConfig,
		// 	idWbot,
		// };

		// Queue.add("SendMessageConfirmar", newMessage);

		res.status(200).json({ message: "Message add queue" });
	} catch (error) {
		next(error);
	}
};