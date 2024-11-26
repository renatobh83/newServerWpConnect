import type { Request, RequestHandler, Response } from "express";

import AppError from "../errors/AppError";
import CheckSettingsHelper from "../helpers/CheckSettings";

import { getIO } from "../libs/scoket";
import CreateUserService from "../services/UserServices/CreateUserService";
import DeleteUserService from "../services/UserServices/DeleteUserService";
import ListUsersService from "../services/UserServices/ListUsersService";
import ShowUserService from "../services/UserServices/ShowUserService";
import UpdateUserConfigsService from "../services/UserServices/UpdateUserConfigsService";
import UpdateUserService from "../services/UserServices/UpdateUserService";

type IndexQuery = {
	searchParam: string;
	pageNumber: string;
};

export const index: RequestHandler = async (req: Request, res: Response) => {
	const { tenantId } = req.user;
	const { searchParam, pageNumber } = req.query as IndexQuery;

	const { users, count, hasMore } = await ListUsersService({
		searchParam,
		pageNumber,
		tenantId,
	});

	res.json({ users, count, hasMore });
};

export const store: RequestHandler = async (req: Request, res: Response) => {
	const { tenantId } = req.user;
	const { email, password, name, profile } = req.body;
	const { users } = await ListUsersService({ tenantId });

	if (users.length >= Number(process.env.USER_LIMIT)) {
		throw new AppError("ERR_USER_LIMIT_USER_CREATION", 400);
	}

	if (
		req.url === "/signup" &&
		(await CheckSettingsHelper("userCreation")) === "disabled"
	) {
		throw new AppError("ERR_USER_CREATION_DISABLED", 403);
	}
	if (req.url !== "/signup" && req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}

	const user = await CreateUserService({
		email,
		password,
		name,
		profile,
		tenantId,
	});

	const io = getIO();
	io.emit(`${tenantId}:user`, {
		action: "create",
		user,
	});

	res.status(200).json(user);
};

export const show: RequestHandler = async (req: Request, res: Response) => {
	const { userId } = req.params;
	const { tenantId } = req.user;

	const user = await ShowUserService(userId, tenantId);

	res.status(200).json(user);
};

export const update: RequestHandler = async (req: Request, res: Response) => {
	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}

	const { userId: userP } = req.params;
	const userData = req.body;
	const { tenantId } = req.user;

	const userId = Number(userP);

	const user = await UpdateUserService({ userData, userId, tenantId });

	const io = getIO();
	io.emit(`${tenantId}:user`, {
		action: "update",
		user,
	});

	res.status(200).json(user);
};

export const updateConfigs: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}

	const { userId } = req.params;
	const userConfigs = req.body;
	const { tenantId } = req.user;

	await UpdateUserConfigsService({ userConfigs, userId, tenantId });

	res.status(200).json();
};

export const remove: RequestHandler = async (req: Request, res: Response) => {
	const { userId } = req.params;
	const { tenantId } = req.user;
	const userIdRequest = Number(req.user.id);

	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}

	await DeleteUserService(userId, tenantId, userIdRequest);

	const io = getIO();
	io.emit(`${tenantId}:user`, {
		action: "delete",
		userId,
	});

	res.status(200).json({ message: "User deleted" });
};
