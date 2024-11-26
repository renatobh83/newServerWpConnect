import axios from "axios";
import type { Request, RequestHandler, Response } from "express";
import AppError from "../errors/AppError";
import { SendRefreshToken } from "../helpers/SendRefreshToken";
import User from "../models/User";
import { RefreshTokenService } from "../services/AuthServices/RefreshTokenService";
import AuthUserService from "../services/UserServices/AuthUserService";

export const store: RequestHandler = async (req: Request, res: Response) => {
	// const io = getIO();

	const { email, password } = req.body;

	const { token, user, refreshToken, usuariosOnline } = await AuthUserService({
		email,
		password,
	});

	SendRefreshToken(res, refreshToken);

	const params = {
		token,
		username: user.name,
		email: user.email,
		profile: user.profile,
		status: user.status,
		userId: user.id,
		tenantId: user.tenantId,
		queues: user.queues,
		usuariosOnline,
		configs: user.configs,
	};

	// io.emit(`${params.tenantId}:users`, {
	//   action: "update",
	//   data: {
	//     username: params.username,
	//     email: params.email,
	//     isOnline: true,
	//     lastLogin: new Date()
	//   }
	// });

	res.status(200).json(params);
};

export const update: RequestHandler = async (req: Request, res: Response) => {
	const token: string = req.cookies.jrt;

	if (!token) {
		throw new AppError("ERR_SESSION_EXPIRED", 401);
	}

	const { newToken, refreshToken } = await RefreshTokenService(token);

	SendRefreshToken(res, refreshToken);

	res.json({ token: newToken });
};

export const logout: RequestHandler = async (req: Request, res: Response) => {
	const { userId } = req.body;
	if (!userId) {
		throw new AppError("ERR_USER_NOT_FOUND", 404);
	}
	// const io = getIO();

	const userLogout = await User.findByPk(userId);

	if (userLogout) {
		userLogout.update({ isOnline: false, lastLogout: new Date() });
	}

	// io.emit(`${userLogout?.tenantId}:users`, {
	//   action: "update",
	//   data: {
	//     username: userLogout?.name,
	//     email: userLogout?.email,
	//     isOnline: false,
	//     lastLogout: new Date()
	//   }
	// });

	// SendRefreshToken(res, refreshToken);

	res.json({ message: "USER_LOGOUT" });
};
