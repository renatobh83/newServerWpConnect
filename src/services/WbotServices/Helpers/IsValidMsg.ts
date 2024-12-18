import type { Message } from "@wppconnect-team/wppconnect";
import { isMsgConfirmacao } from "./isMsgConfirmacao";



export const isValidMsg = async (msg: Message): Promise<boolean> => {

	if (msg.from === "status@broadcast") return false;

	// if (await isMsgConfirmacao({ msg, tenantId })) {
	// 	return false
	// }

	if (
		msg.type === "chat" ||
		msg.type === "audio" ||
		msg.type === "ptt" ||
		msg.type === "video" ||
		msg.type === "image" ||
		msg.type === "document" ||
		msg.type === "vcard" ||
		msg.type === "sticker"
	)
		return true;

	return false;
};
