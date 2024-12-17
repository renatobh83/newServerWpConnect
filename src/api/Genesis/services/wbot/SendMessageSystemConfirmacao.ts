import { Whatsapp, Message as WbotMessage } from "@wppconnect-team/wppconnect"
import ProcessBodyData from "../../../../helpers/ProcessBodyData";
import VerifyContact from "../../../../services/WbotServices/Helpers/VerifyContact";


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


    console.log(idNumber)
    const msgContact = await wbot.getContact(idNumber.id._serialized);
    console.log(msgContact)
    // const contact = await VerifyContact(idNumber, data.tenantId);

    // let ticket = await FindorCreateConfirmacaoTicket({
    //   contact: contact.id,
    //   tenantId: data.tenantId,
    //   channel: "Whatsapp",
    //   data,
    //   contatoSend: msgContact.id._serialized
    // });

    // if (ticket.confirmacaoJaEnviada) {
    //   logger.info('Mensagem ja enviada para esse atendimento')
    //   return
    // }

    // const template = CreateTemplateMessageService({
    //   msg: bodyProcessed.notificacao,
    //   hora: ticket.atendimentoHora
    // });

    // message = await wbot.sendMessage(msgContact.id._serialized,template.body, {
    //   linkPreview: false
    // });
    // if(message ){
    //  await Confirmacao.update({
    //     enviada: new Date(message.timestamp * 1000)
    //   },{
    //     where: {
    //       id: ticket.id
    //     }
    //   })
    // }
    logger.info("sendMessage", message.id);
    return true
}




export default SendMessageSystemConfirmacao

