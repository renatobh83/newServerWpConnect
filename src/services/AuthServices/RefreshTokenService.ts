import { verify } from "jsonwebtoken";
import authConfig from "../../config/auth";
import AppError from "../../errors/AppError";
import {
	createAccessToken,
	createRefreshToken,
} from "../../helpers/CreateTokens";
import ShowUserService from "../UserServices/ShowUserService";

interface RefreshTokenPayload {
	id: string;
	tokenVersion: number;
}

interface Response {
	newToken: string;
	refreshToken: string;
}

export const RefreshTokenService = async (token: string): Promise<Response> => {
	// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
	let decoded;

	try {
		decoded = verify(token, authConfig.refreshSecret);
	} catch (err) {
		throw new AppError("ERR_SESSION_EXPIRED", 401);
	}

	const { id, tokenVersion } = decoded as RefreshTokenPayload;

	const user = await ShowUserService(id, 1);

	if (user.tokenVersion !== tokenVersion) {
		throw new AppError("ERR_SESSION_EXPIRED", 401);
	}

	const newToken = createAccessToken(user);
	const refreshToken = createRefreshToken(user);

	return { newToken, refreshToken };
};
