import type Contact from "../../../models/Contact";
import type {
	ProfilePicThumbObj,
	Contact as WbotContact,
} from "@wppconnect-team/wppconnect";
import CreateOrUpdateContactService from "../../ContactServices/CreateOrUpdateContactService";
import { getId } from "../../../utils/normalize";

const VerifyContact = async (
	msgContact: WbotContact,
	tenantId: number,
	profilePicThumbObj?: ProfilePicThumbObj,
): Promise<Contact> => {
	let profilePicUrl = "";
	const number = getId(msgContact);
	if (profilePicThumbObj) {
		profilePicUrl = profilePicThumbObj.imgFull;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const contactData: any = {
		name: msgContact.name || msgContact.pushname || msgContact.shortName,
		number: number.split("@")[0],
		profilePicUrl,
		tenantId,
		pushname: msgContact.pushname,
		isUser: msgContact.isUser,
		isWAContact: msgContact.isWAContact,
		isGroup: null,
	};

	const contact = await CreateOrUpdateContactService(contactData);

	return contact;
};

export default VerifyContact;
