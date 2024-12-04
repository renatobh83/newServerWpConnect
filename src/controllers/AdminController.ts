import type { NextFunction, Request, RequestHandler, Response } from "express";
import { getIO } from "../libs/scoket";
import AdminListChannelsService from "../services/AdminServices/AdminListChannelsService";
import AdminListChatFlowService from "../services/AdminServices/AdminListChatFlowService";
import AdminListSettingsService from "../services/AdminServices/AdminListSettingsService";
import AdminListTenantsService from "../services/AdminServices/AdminListTenantsService";
import AdminListUsersService from "../services/AdminServices/AdminListUsersService";
import AdminUpdateUserService from "../services/AdminServices/AdminUpdateUserService";
import UpdateSettingService from "../services/SettingServices/UpdateSettingService";
import CreateWhatsAppService from "../services/WhatsappService/CreateWhatsAppService";

type IndexQuery = {
	searchParam: string;
	pageNumber: string;
};

type IndexQuerySettings = {
	tenantId?: string | number;
};

interface ChannelData {
	name: string;
	status?: string;
	isActive?: string;
	tokenTelegram?: string;
	instagramUser?: string;
	instagramKey?: string;
	type: "waba" | "instagram" | "telegram" | "whatsapp";
	wabaBSP?: string;
	tokenAPI?: string;
	tenantId: number;
}

// export const indexUsers = async (
// 	req: Request,
// 	res: Response,
// ): Promise<Response> => {
// 	const { searchParam, pageNumber } = req.query as IndexQuery;
// 	const { users, count, hasMore } = await AdminListUsersService({
// 		searchParam,
// 		pageNumber,
// 	});
// 	return res.status(200).json({ users, count, hasMore });
// };
export const indexUsers: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { searchParam, pageNumber } = req.query as IndexQuery;
		const { users, count, hasMore } = await AdminListUsersService({
			searchParam,
			pageNumber,
		});
		res.status(200).json({ users, count, hasMore });
	} catch (error) {
		next(error); // Passa o erro para o handler global de erros
	}
};

export const updateUser: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const userData = req.body;
	const { userId } = req.params;
	try {
		const user = await AdminUpdateUserService({ userData, userId });

		const io = getIO();
		if (user) {
			io.emit(`${user.tenantId}:user`, {
				action: "update",
				user,
			});
		}

		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

export const indexTenants: RequestHandler = async (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const tenants = await AdminListTenantsService();
		res.status(200).json(tenants);
	} catch (error) {
		next(error);
	}
};

export const indexChatFlow: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { tenantId } = req.params;
		const chatFlow = await AdminListChatFlowService({ tenantId });
		res.status(200).json(chatFlow);
	} catch (error) {
		next(error);
	}
};

export const indexSettings: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.params as IndexQuerySettings;
	try {
		const settings = await AdminListSettingsService(tenantId);

		res.status(200).json(settings);
	} catch (error) {
		next(error);
	}
};

export const updateSettings: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.params;
	const { value, key } = req.body;
	try {
		const setting = await UpdateSettingService({
			key,
			value,
			tenantId,
		});

		const io = getIO();
		io.emit(`${tenantId}:settings`, {
			action: "update",
			setting,
		});

		res.status(200).json(setting);
	} catch (error) {
		next(error);
	}
};

export const indexChannels: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const { tenantId } = req.query as any;
	try {
		const channels = await AdminListChannelsService({ tenantId });

		res.status(200).json(channels);
	} catch (error) {
		next(error);
	}
};

export const storeChannel: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const {
		name,
		tenantId,
		tokenTelegram,
		instagramUser,
		instagramKey,
		type,
		wabaBSP,
		tokenAPI,
	} = req.body;
	try {
		const data: ChannelData = {
			name,
			status: "DISCONNECTED",
			tenantId,
			tokenTelegram,
			instagramUser,
			instagramKey,
			type,
			wabaBSP,
			tokenAPI,
		};

		const channels = await CreateWhatsAppService(data);
		res.status(200).json(channels);
	} catch (error) {
		next(error);
	}
};
