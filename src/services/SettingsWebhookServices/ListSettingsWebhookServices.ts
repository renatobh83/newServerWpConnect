import ApiConfirmacao from "../../models/ApiConfirmacao"
interface Request {
    tenantId: number;
  }

  interface Response {
    link: string,
    usuario: string,
    senha: string
  }
const ListSettingsWebhookServices = async ({
    tenantId
  }: Request): Promise<any> => {

        const data = await ApiConfirmacao.findAll({
            where: { tenantId },
        }) as unknown as Response

        return data
  }

  export default ListSettingsWebhookServices