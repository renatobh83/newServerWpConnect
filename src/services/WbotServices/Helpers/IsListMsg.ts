import type { Message } from "@wppconnect-team/wppconnect";
import { isMsgConfirmacao } from "./isMsgConfirmacao";

interface MessageFilename extends Message {
	filename: string
}

export interface RequestIsValid {
	msg: MessageFilename

}

export const IsListMsg = async ({ msg }: RequestIsValid): Promise<boolean> => {
	if (
		msg.type === "list" ||
		msg.type === "list_response"
	) {

	}


	return false;
};
