import type { Chat } from "@wppconnect-team/wppconnect";
// import SendWhatsAppMedia from "../services/WbotServices/SendWhatsAppMedia";
// import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage";

type Payload = {
	ticket: any;
	messageData: any;
	media: any;
	userId: any;
};

const SendMessageSystemProxy = async ({
	ticket,
	messageData,
	media,
	userId,
}: Payload): Promise<Chat> => {
	let message: Chat;

	if (messageData.mediaName) {
		// message = await SendWhatsAppMedia({ media, ticket, userId });
	}

	if (!media) {
		// message = await SendWhatsAppMessage({
		// 	body: messageData.body,
		// 	ticket,
		// 	quotedMsg: messageData?.quotedMsg,
		// });
	}

	return message;
};

export default SendMessageSystemProxy;
