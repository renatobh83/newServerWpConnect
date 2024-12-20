import Confirmacao from "../../../models/Confirmacao";
import CheckConfirmationResponse from "../../../api/Genesis/helpers/CheckResponseConfirmacao";
import ShowWhatsAppService from "../../WhatsappService/ShowWhatsAppService";


export const isMsgConfirmacao = async ({ msg, wbot }: any): Promise<boolean> => {
    try {

        const whatsapp = await ShowWhatsAppService({ id: wbot.id });

        const { tenantId } = whatsapp;
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


        return true


    } catch (error) {
        throw new Error("Error", error);

    }
}