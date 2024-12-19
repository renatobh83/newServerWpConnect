import { Message } from "@wppconnect-team/wppconnect";
import AppError from "../../../errors/AppError";
import { getWbot } from "../../../libs/wbot";
import ApiConfig from "../../../models/ApiConfig";
import ApiMessage from "../../../models/ApiMessage";
import { addJob } from "../../../libs/Queue";

export const MensagemLaudoPronto = async ({ apiId, authToken, idWbot, ...rest }: any) => {

    const apiConfig = await ApiConfig.findOne({
        where: {
            id: apiId,
            authToken,
        },
    });

    if (apiConfig === null) {
        throw new AppError("ERR_SESSION_NOT_AUTH_TOKEN", 403);
    }
    const newMessage = {
        ...rest,
        externalKey: authToken,
        apiId,
        sessionId: apiConfig.sessionId,
        tenantId: apiConfig.tenantId,
        apiConfig: apiConfig,
        idWbot,
    };
    addJob("SendMessageLaudoPronto", newMessage);
}