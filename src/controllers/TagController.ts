import type { NextFunction, Request, RequestHandler, Response } from "express";
import * as Yup from "yup";
import AppError from "../errors/AppError";

import CreateTagService from "../services/TagServices/CreateTagService";
import DeleteTagService from "../services/TagServices/DeleteTagService";
import ListTagService from "../services/TagServices/ListTagService";
import UpdateTagService from "../services/TagServices/UpdateTagService";

interface TagData {
	tag: string;
	color: string;
	isActive: boolean;
	userId: number;
	tenantId: number;
}

export const store: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	if (req.user.profile !== "admin") {
		throw new AppError("ERR_NO_PERMISSION", 403);
	}

	const newTag: TagData = { ...req.body, userId: req.user.id, tenantId };

	const schema = Yup.object().shape({
		tag: Yup.string().required(),
		color: Yup.string().required(),
		userId: Yup.number().required(),
		tenantId: Yup.number().required(),
	});

	try {
		await schema.validate(newTag);
	} catch (error) {
		throw new AppError(error.message);
	}

	const tag = await CreateTagService(newTag);

	res.status(200).json(tag);
};

export const index: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	const { isActive } = req.query;

	try {
		const tags = await ListTagService({
			tenantId,
			// eslint-disable-next-line eqeqeq
			isActive: isActive ? isActive === "true" : false,
		});
		res.status(200).json(tags);
	} catch (error) {
		next(error);
	}
};

export const update: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}
		const tagData: TagData = { ...req.body, userId: req.user.id, tenantId };

		const schema = Yup.object().shape({
			tag: Yup.string().required(),
			color: Yup.string().required(),
			isActive: Yup.boolean().required(),
			userId: Yup.number().required(),
		});

		try {
			await schema.validate(tagData);
		} catch (error) {
			throw new AppError(error.message);
		}

		const { tagId } = req.params;
		const tagObj = await UpdateTagService({
			tagData,
			tagId,
		});

		res.status(200).json(tagObj);
	} catch (error) {
		next(error);
	}
};

export const remove: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}
		const { tagId } = req.params;

		await DeleteTagService({ id: tagId, tenantId });
		res.status(200).json({ message: "Tag deleted" });
	} catch (error) {
		next(error);
	}
};
