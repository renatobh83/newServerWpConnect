import { Message } from "@wppconnect-team/wppconnect";
import AppError from "../../../errors/AppError";
import { getWbot } from "../../../libs/wbot";
import ApiConfig from "../../../models/ApiConfig";
import ApiMessage from "../../../models/ApiMessage";

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
    const wbot = getWbot(apiConfig.sessionId);
    const [{ contato }] = rest.contatos;
    const idNumber = await wbot.checkNumberStatus(contato)
    const { paciente_nome, procedimento_nome, link_la } = JSON.parse(rest.contatos[0].notificacao)

    const templateMessage = `Olá ${paciente_nome}, gostaria de informar que o laudo do seu exame de ${procedimento_nome} já está pronto.\nPara acessá-lo, por favor, clique no link abaixo:\n${link_la}`

    const a: Message = await wbot.sendText(idNumber.id._serialized, templateMessage)
    const messageData: ApiMessage = {
        messageId: a.id,
        externalKey: authToken,
        body: a.body,
        ack: a.ack,
        number: idNumber.id._serialized,
        timestamp: a.timestamp,
        sessionId: apiConfig.sessionId,
        tenantId: apiConfig.tenantId,
        apiConfig,
    } as unknown as ApiMessage

    await ApiMessage.create(messageData)

}