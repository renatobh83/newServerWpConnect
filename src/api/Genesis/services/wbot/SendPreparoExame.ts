import { Whatsapp, Message as WbotMessage } from "@wppconnect-team/wppconnect"
import ProcessBodyData from "../../../../helpers/ProcessBodyData";
import FindOrCreateConfirmacao from "../FindOrCreateConfirmacaoTicket";
import CreateTemplateMessageService from "../../../../services/MessageServices/CreateTemplateMessageService";
import Confirmacao from "../../../../models/Confirmacao";
import { logger } from "../../../../utils/logger";
import GetTicketWbot from "../../../../helpers/GetTicketWbot";


interface Session extends Whatsapp {
    id: number;
}

const SendPreparoExame = async ({
    msgConfirmacao,
    base64Html,
    sendTo,
}
) => {

    let message: any = {} as WbotMessage;
    try {
        const formattedBase64 = `data:text/html;base64,${base64Html}`;

        const wbot = await GetTicketWbot(msgConfirmacao)
        message = await wbot.sendFile(sendTo, formattedBase64, {
            caption: 'Preparo de exame',
            filename: 'Preparo de exame'
        })

        if (message.sendMsgResult.messageSendResult === "OK") {
            msgConfirmacao.enviada = Date.now()
            msgConfirmacao.status = 'PREPARO ENVIADO'
            msgConfirmacao.lastMessage = "Preparo enviado"
            msgConfirmacao.closedAt = Math.floor(Date.now() / 1000)
            msgConfirmacao.preparoEnviado = true
            await msgConfirmacao.save()

        }
    } catch (error) {
        logger.error(error)
    }






    logger.info("sendMessage", message.id);

}




export default SendPreparoExame

