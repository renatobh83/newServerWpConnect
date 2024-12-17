import type {
	ProfilePicThumbObj,
	Contact as WbotContact,
} from "@wppconnect-team/wppconnect";
import type Contact from "../../../models/Contact";
import { getId } from "../../../utils/normalize";
import CreateOrUpdateContactService from "../../ContactServices/CreateOrUpdateContactService";

const VerifyContact2 = async (
	idNumber: object,
	tenantId: number,
	profilePicThumbObj?: ProfilePicThumbObj,
): Promise<void> => {
	let profilePicUrl = "";

	const number = getId(idNumber);
	console.log(number)

	// if (profilePicThumbObj) {
	// 	profilePicUrl = profilePicThumbObj.imgFull;
	// }

	// // biome-ignore lint/suspicious/noExplicitAny: Contact Return
	// const contactData: any = {
	// 	name: msgContact.name || msgContact.pushname || msgContact.shortName,
	// 	number: number.split("@")[0],
	// 	profilePicUrl,
	// 	tenantId,
	// 	pushname: msgContact.pushname,
	// 	isUser: msgContact.isUser,
	// 	isWAContact: msgContact.isWAContact,
	// 	isGroup: !msgContact.isUser,
	// };

	// const contact = await CreateOrUpdateContactService(contactData);

	// return contact;
};

export default VerifyContact2;
