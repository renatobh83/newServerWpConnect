import { Op } from "sequelize";
import AppError from "../../errors/AppError";
import ApiConfirmacao from "../../models/ApiConfirmacao"

interface Request {
  expDate: string,
  action: string[],
  nomeApi: string,
  usuario: string,
  senha: string,
  baseURl: string,
  tenantId: number
  id: string
}
export const UpdateSettingsWebhookServices = async ({ baseURl, nomeApi, senha, usuario, id, action, tenantId }: Request) => {

  const findApi = await ApiConfirmacao.findOne({
    where: { tenantId, id }
  })

  // Verifica se outro registro já possui o mesmo nomeApi
  const duplicateApi = await ApiConfirmacao.findOne({
    where: {
      tenantId,
      nomeApi,
      id: { [Op.ne]: findApi.id }, // Exclui o registro atual da verificação
    },

  });

  if (duplicateApi) {
    throw new AppError("ERR_API_NAME_EXISTS", 404);
  }

  // Atualiza os campos do registro encontrado
  const updatedApi = await findApi.update({
    baseURl,
    senha,
    usuario,
    nomeApi,
    action
  });

  return updatedApi;
}