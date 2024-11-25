import type { Chat } from "@wppconnect-team/wppconnect";
import SendMessageBlob from "../services/WbotServices/SendMessageBlob";

type Payload = {
	ticket: any;
	blob: string;
	userId: number;
};

const SendMessageBlobHtml = async ({
	ticket,
	blob,
	userId,
}: Payload): Promise<Chat> => {
	// biome-ignore lint/style/useConst: <explanation>
	let message: Chat;
	message = await SendMessageBlob({ base64Html: blob, ticket, userId });
	return message;
};

export default SendMessageBlobHtml;
