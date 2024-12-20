import type { NextFunction, Request, RequestHandler, Response } from "express";
import * as Yup from "yup";
import AppError from "../errors/AppError";

import CancelCampaignService from "../services/CampaignServices/CancelCampaignService";
import CreateCampaignService from "../services/CampaignServices/CreateCampaignService";
import DeleteCampaignService from "../services/CampaignServices/DeleteCampaignService";
import ListCampaignService from "../services/CampaignServices/ListCampaignService";
import StartCampaignService from "../services/CampaignServices/StartCampaignService";
import UpdateCampaignService from "../services/CampaignServices/UpdateCampaignService";

interface CampaignData {
	name: string;
	start: string;
	end: string;
	message1: string;
	message2: string;
	message3: string;
	mediaUrl: string;
	userId: string;
	sessionId: string;
	delay: string;
	tenantId: string;
}

export const store: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	const medias = req.files as Express.Multer.File[];
	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}


		const campaign: CampaignData = {
			...req.body,
			userId: req.user.id,
			message1: req.body.messages[0],
			message2: req.body.messages[1],
			message3: req.body.messages[2],
			tenantId,
		};
		const schema = Yup.object().shape({
			name: Yup.string().required(),
			start: Yup.string().required(),
			message1: Yup.string().required(),
			message2: Yup.string().required(),
			message3: Yup.string().required(),
			userId: Yup.string().required(),
			sessionId: Yup.string().required(),
			tenantId: Yup.number().required(),
		});

		try {
			await schema.validate(campaign);
		} catch (error) {
			throw new AppError(error.message);
		}

		const newCampaign = await CreateCampaignService({
			campaign,
			medias,
		});

		res.status(200).json(newCampaign);
	} catch (error) {
		next(error);
	}
};

export const index: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { tenantId } = req.user;
		const tags = await ListCampaignService({
			tenantId,
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
	const medias = req.files as Express.Multer.File[];
	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}

		const campaignData: CampaignData = {
			...req.body,
			message1: req.body.messages[0],
			message2: req.body.messages[1],
			message3: req.body.messages[2],
			userId: req.user.id,
			tenantId,
		};

		const schema = Yup.object().shape({
			name: Yup.string().required(),
			start: Yup.string().required(),
			message1: Yup.string().required(),
			message2: Yup.string().required(),
			message3: Yup.string().required(),

			userId: Yup.string().required(),
			sessionId: Yup.string().required(),
			tenantId: Yup.number().required(),
		});

		try {
			await schema.validate(campaignData);
		} catch (error) {
			throw new AppError(error.message);
		}

		const { campaignId } = req.params;
		const campaignObj = await UpdateCampaignService({
			campaignData,
			medias,
			campaignId,
			tenantId,
		});

		res.status(200).json(campaignObj);
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
		const { campaignId } = req.params;

		await DeleteCampaignService({ id: campaignId, tenantId });
		res.status(200).json({ message: "Campaign deleted" });
	} catch (error) {
		next(error);
	}
};

export const startCampaign: RequestHandler = async (
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

		await StartCampaignService({
			campaignId,
			tenantId,
			options: {
				delay: 2000,
			},
		});

		res.status(200).json({ message: "Campaign started" });
	} catch (error) {
		next(error);
	}
};

export const cancelCampaign: RequestHandler = async (
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

		await CancelCampaignService({
			campaignId,
			tenantId,
		});

		res.status(200).json({ message: "Campaign canceled" });
	} catch (error) {
		next(error);
	}
};
