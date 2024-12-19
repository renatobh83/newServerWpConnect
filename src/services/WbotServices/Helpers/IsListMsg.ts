import type { Message, Whatsapp } from "@wppconnect-team/wppconnect";
import { isMsgConfirmacao } from "./isMsgConfirmacao";

interface MessageFilename extends Message {
	filename: string
}

export interface RequestIsValid {
	msg: MessageFilename
	wbot: Whatsapp
}

export const isListMsg = async ({ msg, wbot }: RequestIsValid): Promise<boolean> => {
	if (
		msg.type === "list" ||
		msg.type === "list_response"
	) {
		if (await isMsgConfirmacao({ msg, wbot })) return false

		return false
	}


	return true;
};
