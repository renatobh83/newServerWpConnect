
import Confirmacao from "../../../models/Confirmacao";
import CheckConfirmationResponse from "../../../api/Genesis/helpers/CheckResponseConfirmacao";
import { RequestIsValid } from "./IsValidMsg";
import { logger } from "../../../utils/logger";



export const isMsgConfirmacao = async ({ msg, tenantId }: RequestIsValid): Promise<boolean> => {

    const msgConfirmacao = await Confirmacao.findOne({
        where: {
            contatoSend: msg.from,
            closedAt: null,
            tenantId
        },
    });

    if (!msgConfirmacao) {
        return false
    }

    if (msg.type === 'list_response') {
        await CheckConfirmationResponse({ data: msg, msgConfirmacao, tenantId })
        return
    }
    if (msg.body !== 'Favor responder pela lista') {
        // Descrever uma logica para enviar uma msg que deve usar a lista
        logger.warn('Falta Colocar a logica para informar ao usuario')
        return
    }
    return true


}