import AppError from "../../../errors/AppError";
import { addJob } from "../../../libs/Queue";
import ApiConfig from "../../../models/ApiConfig";

interface Request {
	apiId: string
	authToken: string
	idWbot: string,

}
interface MessageDataRequest {
	apiId: string;
	sessionId: number;
	media?: Express.Multer.File | string;
	externalKey: string;
	tenantId: number;
	apiConfig: ApiConfig;
	idWbot: string;
}
export const MensagemConfirmacaoService = async ({ apiId, authToken, idWbot, ...rest }: Request) => {

	const apiConfig = await ApiConfig.findOne({
		where: {
			id: apiId,
			authToken,
		},
	});

	if (apiConfig === null) {
		throw new AppError("ERR_SESSION_NOT_AUTH_TOKEN", 403);
	}

	const newMessage: MessageDataRequest = {
		...rest,
		externalKey: authToken,
		apiId,
		sessionId: apiConfig.sessionId,
		tenantId: apiConfig.tenantId,
		apiConfig: apiConfig,
		idWbot,
	};

	addJob("SendMessageConfirmar", newMessage);
}