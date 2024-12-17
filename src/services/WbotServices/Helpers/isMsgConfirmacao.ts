import { Message } from "@wppconnect-team/wppconnect";
import Confirmacao from "../../../models/Confirmacao";

export const isMsgConfirmacao = async (msg: Message): Promise<boolean> => {
    const msgConfirmacao = await Confirmacao.findOne({
        where: {
            contatoSend: msg.from,
            answered: false,
            closedAt: null,
        },
    });
    if (msgConfirmacao) {
        return true
    }
    return false
}