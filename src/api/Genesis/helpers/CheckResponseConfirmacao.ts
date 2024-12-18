import { addJob } from "../../../libs/Queue";
import Confirmacao from "../../../models/Confirmacao";



interface Data {
  data: any;
  msgConfirmacao?: Confirmacao;
  tenantId: number
}

const CheckConfirmationResponse = async ({
  msgConfirmacao,
  data,
  tenantId
}: Data): Promise<void> => {
  const listResponse = data.listResponse

  msgConfirmacao.status = "RESPONDIDA";
  msgConfirmacao.lastMessage = listResponse.description;
  msgConfirmacao.answered = true;
  msgConfirmacao.lastMessageAt = new Date().getTime();
  msgConfirmacao.save();

  switch (listResponse.singleSelectReply.selectedRowId) {
    case "1":

      addJob("WebHookConfirma", {
        msgConfirmacao,
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
