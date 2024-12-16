import AppError from "../../errors/AppError";
import ApiConfirmacao from "../../models/ApiConfirmacao"

interface Request {

    tenantId: number
    id: string
  }
export const DeleteSettingsWebhookServices = async ({ id, tenantId}:Request) => {

    const findApi = await ApiConfirmacao.findOne({
        where: {tenantId, id}
    })


      if (!findApi) {
        throw new AppError("ERR_API_NAME_NOT_FOUND", 404);
      }

      return findApi.destroy();
}