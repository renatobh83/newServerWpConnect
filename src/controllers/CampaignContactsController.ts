// import * as Yup from "yup";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import AppError from "../errors/AppError";

import CreateCampaignContactsService from "../services/CampaignContactsServices/CreateCampaignContactsService";
import DeleteAllCampaignContactsService from "../services/CampaignContactsServices/DeleteAllCampaignContactsService";
import DeleteCampaignContactsService from "../services/CampaignContactsServices/DeleteCampaignContactsService";
import ListCampaignContactsService from "../services/CampaignContactsServices/ListCampaignContactsService";

export const store: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		// const { tenantId } = req.user;
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}

		const contacts = [...req.body];
		const { campaignId } = req.params;

		const cc = await CreateCampaignContactsService({
			campaignContacts: contacts,
			campaignId,
		});

		res.status(200).json(cc);
	} catch (error) {
		next(error);
	}
};

export const index: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	const { campaignId } = req.params;
	try {
		const tags = await ListCampaignContactsService({
			campaignId,
			tenantId,
			// eslint-disable-next-line eqeqeq
		});
		res.status(200).json(tags);
	} catch (error) {
		next(error);
	}
};

// export const update: RequestHandler = async (
//   req: Request,
//   res: Response
// ) => {
//   const { tenantId } = req.user;

//   if (req.user.profile !== "admin") {
//     throw new AppError("ERR_NO_PERMISSION", 403);
//   }
//   const tagData: TagData = { ...req.body, userId: req.user.id, tenantId };

//   const schema = Yup.object().shape({
//     tag: Yup.string().required(),
//     color: Yup.string().required(),
//     isActive: Yup.boolean().required(),
//     userId: Yup.number().required()
//   });

//   try {
//     await schema.validate(tagData);
//   } catch (error) {
//     throw new AppError(error.message);
//   }

//   const { tagId } = req.params;
//   const tagObj = await UpdateTagService({
//     tagData,
//     tagId
//   });

//    res.status(200).json(tagObj);
// };

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
		const { campaignId, contactId } = req.params;

		await DeleteCampaignContactsService({ campaignId, contactId, tenantId });
		res.status(200).json({ message: "Campagin Contact deleted" });
	} catch (error) {
		next(error);
	}
};

export const removeAll: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}
		const { campaignId } = req.params;

		await DeleteAllCampaignContactsService({ campaignId, tenantId });
		res.status(200).json({ message: "Campagin Contacts deleted" });
	} catch (error) {
		next(error);
	}
};
