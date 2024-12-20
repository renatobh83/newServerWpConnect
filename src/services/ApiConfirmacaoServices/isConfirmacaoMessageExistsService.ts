import type { Message as WbotMessage } from "@wppconnect-team/wppconnect";
import Confirmacao from "../../models/Confirmacao";

export const isConfirmacaoMessageExistsService = async (msg: WbotMessage, tenantId: number): Promise<boolean> => {

    const message = await Confirmacao.findOne({
        where: {
            contatoSend: msg.fromMe ? msg.to : msg.from,
            closedAt: null,
            tenantId
        }
    });

    if (!message) {
        return false;
    }
    return true;
};