import type { Message as WbotMessage } from "@wppconnect-team/wppconnect";
import SendWhatsAppMedia from "../services/WbotServices/SendWhatsAppMedia";
import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage";

type Payload = {
	ticket: any;
	messageData: any;
	media: any;
	userId: any;
};
interface CustomMessage extends WbotMessage {
	messageId?: string;
}

const SendMessageSystemProxy = async ({
	ticket,
	messageData,
	media,
	userId,
}: Payload): Promise<CustomMessage | null> => {
	let message: CustomMessage | null = null; // Inicializa com um valor padrão

	if (messageData.mediaName) {
		message = await SendWhatsAppMedia({ media, ticket, userId });
	}

	if (!media) {
		message = await SendWhatsAppMessage({
			body: messageData.body,
			ticket,
			quotedMsg: messageData?.quotedMsg,
		});
	}
	if (message.ack === 0) return;
	return message;
};

export default SendMessageSystemProxy;
