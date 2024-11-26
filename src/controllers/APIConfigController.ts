import * as Yup from "yup";
import type { Request, RequestHandler, Response } from "express";

import CreateApiConfigService from "../services/ApiConfigServices/CreateApiConfigService";
import ListApiConfigService from "../services/ApiConfigServices/ListApiConfigService";
import AppError from "../errors/AppError";
import UpdateApiConfigService from "../services/ApiConfigServices/UpdateApiConfigService";
import DeleteApiConfigService from "../services/ApiConfigServices/DeleteApiConfigService";
import RenewApiConfigTokenService from "../services/ApiConfigServices/RenewApiConfigTokenService";

interface ApiData {
	name: string;
	sessionId: number;
	urlServiceStatus?: string;
	urlMessageStatus?: string;
	userId: number;
	tenantId: number;
	authToken?: string;
	isActive?: boolean;
}

interface RenewData {
	sessionId: number;
	userId: number;
	tenantId: number;
}

export const store: RequestHandler = async (req: Request, res: Response) => {
	const { tenantId, id } = req.user;
	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}

	const newApi: ApiData = { ...req.body, userId: id, tenantId };

	const schema = Yup.object().shape({
		name: Yup.string().required(),
		sessionId: Yup.number().required(),
		urlServiceStatus: Yup.string().url().nullable(),
		urlMessageStatus: Yup.string().url().nullable(),
		userId: Yup.number().required(),
		tenantId: Yup.number().required(),
	});

	try {
		await schema.validate(newApi);
	} catch (error) {
		throw new AppError(error.message);
	}

	const api = await CreateApiConfigService(newApi);

	res.status(200).json(api);
};

export const index: RequestHandler = async (req: Request, res: Response) => {
	const { tenantId } = req.user;
	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}
	const apis = await ListApiConfigService({ tenantId });
	res.status(200).json(apis);
};

export const update: RequestHandler = async (req: Request, res: Response) => {
	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}
	const { tenantId, id } = req.user;
	const { apiId } = req.params;

	const apiData: ApiData = { ...req.body, userId: id, tenantId };

	const schema = Yup.object().shape({
		name: Yup.string().required(),
		sessionId: Yup.number().required(),
		urlServiceStatus: Yup.string().url().nullable(),
		urlMessageStatus: Yup.string().url().nullable(),
		userId: Yup.number().required(),
		tenantId: Yup.number().required(),
		isActive: Yup.boolean().required(),
	});

	try {
		await schema.validate(apiData);
	} catch (error) {
		throw new AppError(error.message);
	}

	const api = await UpdateApiConfigService({
		apiData,
		apiId,
		tenantId,
	});

	res.status(200).json(api);
};

export const remove: RequestHandler = async (req: Request, res: Response) => {
	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}
	const { tenantId } = req.user;
	const { apiId } = req.params;

	await DeleteApiConfigService({ apiId, tenantId });
	res.status(200).json({ message: "API Config Deleted" });
};

export const renewTokenApi: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}

	const { tenantId, id } = req.user;
	const { apiId } = req.params;
	const api: RenewData = { ...req.body, userId: id, tenantId };

	const schema = Yup.object().shape({
		sessionId: Yup.number().required(),
		userId: Yup.number().required(),
		tenantId: Yup.number().required(),
	});

	try {
		await schema.validate(api);
	} catch (error) {
		throw new AppError(error.message);
	}

	const newApi = await RenewApiConfigTokenService({
		apiId,
		userId: api.userId,
		sessionId: api.sessionId,
		tenantId: api.tenantId,
	});

	res.status(200).json(newApi);
};