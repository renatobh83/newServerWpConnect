import type { Message as WbotMessage } from "@wppconnect-team/wppconnect";
import SendWhatsAppMedia from "../services/WbotServices/SendWhatsAppMedia";
import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage";

type Payload = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	ticket: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	messageData: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	media: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

	return message;
};

export default SendMessageSystemProxy;
