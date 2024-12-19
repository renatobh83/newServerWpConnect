import { getWbot } from "../libs/wbot";
import { logger } from "../utils/logger";
import { Message } from "@wppconnect-team/wppconnect";
import ApiMessage from "../models/ApiMessage";



export default {
    key: "SendMessageLaudoPronto",
    options: {
        delay: 6000,
        attempts: 2,
        removeOnComplete: false,
        removeOnFail: false,
        backoff: {
            type: "fixed",
            delay: 60000 * 3, // 3 min
        },
    },

    async handle(data: any) {
        try {
            const { externalKey, apiConfig, tenantId, sessionId } = data

            const [{ contato }] = data.contatos;
            const wbot = getWbot(data.sessionId);

            if (!contato) {
                logger.error('Cotnato nao informado')
                throw new Error("Contato não informado");

            }

            const idNumber = await wbot.checkNumberStatus(contato)
            const { paciente_nome, procedimento_nome, link_la } = JSON.parse(data.contatos[0].notificacao)

            const templateMessage = `Olá ${paciente_nome}, gostaria de informar que o laudo do seu exame de ${procedimento_nome} já está pronto.\nPara acessá-lo, por favor, clique no link abaixo:\n${link_la}`

            const a: Message = await wbot.sendText(idNumber.id._serialized, templateMessage)
            const messageData: ApiMessage = {
                messageId: a.id,
                externalKey: externalKey,
                body: a.body,
                ack: a.ack,
                number: idNumber.id._serialized,
                timestamp: a.timestamp,
                sessionId: sessionId,
                tenantId: tenantId,
                apiConfig,
            } as unknown as ApiMessage


            await ApiMessage.create(messageData)


        } catch (error) {
            throw new Error(error);
        }
    },
};
