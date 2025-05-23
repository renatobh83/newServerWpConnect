// import AppError from "../../errors/AppError";
import { sign } from "jsonwebtoken";
import authConfig from "../../config/auth";
import ApiConfig from "../../models/ApiConfig";

interface Request {
	name: string;
	sessionId: number;
	urlServiceStatus?: string;
	urlMessageStatus?: string;
	authToken?: string;
	userId: number;
	tenantId: number;
}

const CreateApiConfigService = async ({
	name,
	sessionId,
	urlServiceStatus,
	urlMessageStatus,
	userId,
	authToken,
	tenantId,
}: Request): Promise<ApiConfig> => {
	const { secret } = authConfig;

	const token = sign(
		{
			tenantId,
			profile: "admin",
			sessionId,
		},
		secret,
		{
			expiresIn: "730d",
		},
	);

	const api = await ApiConfig.create({
		name,
		sessionId,
		token,
		authToken,
		urlServiceStatus,
		urlMessageStatus,
		userId,
		tenantId,
	});

	return api;
};

export default CreateApiConfigService;
