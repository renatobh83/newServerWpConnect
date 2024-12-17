import { addJob } from "../../../libs/Queue";
import Confirmacao from "../../../models/Confirmacao";



interface Data {
  data: any;
  tenantId: number;
}

const CheckConfirmationResponse = async ({
  tenantId,
  data,
}: Data): Promise<void> => {
  const listResponse = data.listResponse
  const msgConfirmacao = await Confirmacao.findOne({
    where: {
      tenantId: tenantId,
      contatoSend: data.from,
      closedAt: null,
      preparoEnviado: false
    },
  });
  if (!msgConfirmacao) {
    throw new Error('Mensagem processada')
  }

  msgConfirmacao.status = "RESPONDIDA";
  msgConfirmacao.lastMessage = listResponse.description;
  msgConfirmacao.answered = true;
  msgConfirmacao.lastMessageAt = new Date().getTime();
  msgConfirmacao.save();

  switch (listResponse.singleSelectReply.selectedRowId) {
    case "1":

      addJob("WebHookConfirma", {
        idexterno: msgConfirmacao.idexterno,
        procedimentos: msgConfirmacao.procedimentos,
        tenantId,
        contatoSend: data.from,
      });
      break;
    case "2":
      console.log("Resposta cancela:", listResponse);
      //Queue.add("WebHookCancela",{})
      // Lógica adicional aqui
      break;
    default:
      console.log("Resposta inválida:", listResponse);
      // Lógica adicional aqui
      break;
  }
};

export default CheckConfirmationResponse;
