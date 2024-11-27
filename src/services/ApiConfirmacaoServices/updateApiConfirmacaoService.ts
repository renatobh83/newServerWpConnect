import { Sequelize } from "sequelize";
import AppError from "../../errors/AppError";
import ApiConfirmacao from "../../models/ApiConfirmacao";

interface Request {
	id: number;
	status?: string;
	usuario?: string;
	senha?: string;
	action?: string[];
	token: string;
	token2: string;
	expDate: Date;
	nomeApi: string;
	tenantId: number;
	baseURl: string;
}

const UpdateApiConfirmacaoService = async ({
	id,
	status,
	usuario,
	senha,
	action,
	token,
	token2,
	expDate,
	nomeApi,
	tenantId,
	baseURl,
}: Request): Promise<ApiConfirmacao> => {
	const apiData = {
		status,
		usuario,
		senha,
		action,
		nomeApi,
		expDate,
		token,
		token2,
		baseURl,
	};

	const api = await ApiConfirmacao.findOne({
		where: { id: id, tenantId },
	});

	if (!api) {
		throw new AppError("ERR_NO_API_FOUND", 404);
	}

	await api.update(apiData);
	await api.reload();
	return api;
};

export default UpdateApiConfirmacaoService;
