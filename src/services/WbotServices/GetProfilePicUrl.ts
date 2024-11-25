import type { ProfilePicThumbObj } from "@wppconnect-team/wppconnect";
import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import { getWbot } from "../../libs/wbot";
import { logger } from "../../utils/logger";

const GetProfilePicUrl = async (
	number: string,
	tenantId: string | number,
): Promise<ProfilePicThumbObj | string> => {
	try {
		const defaultWhatsapp = await GetDefaultWhatsApp(tenantId);
		const wbot = getWbot(defaultWhatsapp.id);
		const profilePicUrl = await wbot.getProfilePicFromServer(`${number}@c.us`);
		return profilePicUrl;
	} catch (error) {
		logger.error(`GetProfilePicUrl - ${error}`);
		return "";
	}
};

export default GetProfilePicUrl;
