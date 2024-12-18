import { Whatsapp, Message as WbotMessage } from "@wppconnect-team/wppconnect"
import Confirmacao from "../../../../models/Confirmacao";
import { logger } from "../../../../utils/logger";
import GetTicketWbot from "../../../../helpers/GetTicketWbot";


interface Session extends Whatsapp {
    id: number;
}
interface Request {
    msgConfirmacao: Confirmacao
    base64Html: string
    sendTo: string
}

const SendPreparoExame = async ({
    msgConfirmacao,
    base64Html,
    sendTo,
}: Request
) => {

    let message: any = {} as WbotMessage;
    try {
        const formattedBase64 = `data:text/html;base64,${base64Html}`;

        const wbot = await GetTicketWbot(msgConfirmacao)
        message = await wbot.sendFile(sendTo, formattedBase64, {
            caption: 'Preparo de exame',
            filename: 'Preparo de exame',

        })

        if (message.sendMsgResult.messageSendResult === "OK") {
            await Confirmacao.update(
                {
                    enviada: new Date(),
                    status: 'PREPARO ENVIADO',
                    lastMessage: 'Preparo enviado',
                    closedAt: Math.floor(Date.now() / 1000),
                    preparoEnviado: true
                },
                {
                    where: { id: msgConfirmacao.id }
                }
            );


        }
    } catch (error) {
        logger.error(error)
    }

    logger.info("sendMessage", message.id);

}




export default SendPreparoExame

