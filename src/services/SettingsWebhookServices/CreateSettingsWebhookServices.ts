import AppError from "../../errors/AppError"
import ApiConfirmacao from "../../models/ApiConfirmacao"

interface Request {
    expDate: string,
    action: string[],
    nomeApi: string,
    usuario: string,
    senha: string,
    baseURl: string,
    status: string
    tenantId: number
  }
export const CreateSettingsWebhookServices = async ({baseURl, nomeApi, senha, usuario, status, action, tenantId}:Request) => {

    const findApi = await ApiConfirmacao.findOne({
        where: {tenantId, nomeApi}
    })
    if(findApi) {
        throw new AppError("ERR_API_NAME_EXISTS", 404);
    }
    const apiData = await ApiConfirmacao.create({
        baseURl, nomeApi, senha, usuario, action,tenantId,status
    })
    return apiData
}