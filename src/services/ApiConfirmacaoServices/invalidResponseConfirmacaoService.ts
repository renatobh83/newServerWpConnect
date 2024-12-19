import { Message, Whatsapp } from "@wppconnect-team/wppconnect";
import Confirmacao from "../../models/Confirmacao";

let attemps: number = 0
export const invalidResponseConfirmacaoService = async (msg: Message, wbot: Whatsapp, tenantId: number) => {


    if (attemps === 0) {
        await wbot.sendText(msg.from, 'Favor responder pela lista', {
            markIsRead: true
        })
    }
    attemps += 1
    if (attemps >= 3) {
        await wbot.sendText(msg.from, 'Atendimento sendo finalizado.\nFavor entrar em contato com nossa central para confirmar ou cancelar o seu agendamento.', {
            quotedMsg: msg.id
        })
        const msgConfirmacao = await Confirmacao.findOne({
            where: {
                contatoSend: msg.from,
                closedAt: null,
                tenantId
            },
        });
        msgConfirmacao.closedAt = Math.floor(Date.now() / 1000)
        msgConfirmacao.status = "SEM RESPOSTA"
        msgConfirmacao.lastMessage = "Não selecionado na lista"
        await msgConfirmacao.save()
    }
}