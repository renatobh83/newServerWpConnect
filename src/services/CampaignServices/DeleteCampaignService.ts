import AppError from "../../errors/AppError";
import Campaign from "../../models/Campaign";

interface Request {
	id: string;
	tenantId: number | string;
}

const DeleteCampaignService = async ({
	id,
	tenantId,
}: Request): Promise<void> => {
	const campaign = await Campaign.findOne({
		where: { id, tenantId },
	});

	if (!campaign) {
		throw new AppError("ERR_NO_CAMPAIGN_FOUND", 404);
	}

	if (campaign?.status !== "pending" && campaign?.status !== "canceled") {
		throw new AppError("ERR_NO_UPDATE_CAMPAIGN_NOT_IN_CANCELED_PENDING", 404);
	}

	try {
		await campaign.destroy();
	} catch (_error) {
		throw new AppError("ERROR_CAMPAIGN_NOT_EXISTS", 404);
	}
};

export default DeleteCampaignService;
