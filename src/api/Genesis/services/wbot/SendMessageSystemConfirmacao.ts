import { Whatsapp, Message as WbotMessage } from "@wppconnect-team/wppconnect"
import ProcessBodyData from "../../../../helpers/ProcessBodyData";
import FindOrCreateConfirmacao from "../FindOrCreateConfirmacaoTicket";
import CreateTemplateMessageService from "../../../../services/MessageServices/CreateTemplateMessageService";
import Confirmacao from "../../../../models/Confirmacao";
import { logger } from "../../../../utils/logger";


interface Session extends Whatsapp {
    id: number;
}

const SendMessageSystemConfirmacao = async (
    wbot: Session,
    data: any
) => {

    let message: any = {} as WbotMessage;


    const { contato, idExterno, notificacao } = ProcessBodyData(data.contatos[0])
    const idNumber = await wbot.checkNumberStatus(contato)

    if (idNumber.canReceiveMessage === false) return



    let ticket = await FindOrCreateConfirmacao({
        tenantId: data.tenantId,
        channel: "Whatsapp",
        data: notificacao,
        contatoSend: idNumber.id._serialized,
        idExterno
    });


    if (ticket.confirmacaoJaEnviada) {
        logger.info('Mensagem ja enviada para esse atendimento')
        return
    }

    const template = CreateTemplateMessageService({
        msg: notificacao,
        hora: ticket.atendimentoHora
    });

    message = await wbot.sendListMessage(idNumber.id._serialized, {
        buttonText: 'Clique aqui para confirmar',
        description: template.body,
        sections: [
            {
                title: 'Seleciona uma opção abaixo.',
                rows: [
                    {
                        rowId: '1',
                        title: 'Confirmar',
                        description: 'Desejo confirma o agendamento',
                    },
                    {
                        rowId: '2',
                        title: 'Cancelar',
                        description: 'Desejo cancelar o agendamento.',
                    },
                ],
            },
        ],
    })


    if (message) {
        await Confirmacao.update({
            enviada: new Date(message.timestamp * 1000),
            status: 'ENVIADA',
            lastMessage: template.body,
            whatsappId: wbot.id
        }, {
            where: {
                id: ticket.id
            }
        })
    }

    logger.info("sendMessage", message.id);

}




export default SendMessageSystemConfirmacao

