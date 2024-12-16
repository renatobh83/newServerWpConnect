import { NextFunction,Request , Response } from "express";

export const sendMessageConfirmacao = async (
	_req: Request,
	res: Response,
	next: NextFunction,
): Promise<Response> => {
	try {
		// const { contatos }: Configuracao = req.body;
		// const { apiId, authToken, idWbot } = req.params;

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

		return res.status(200).json({ message: "Message add queue" });
	} catch (error) {
		next(error);
	}
};