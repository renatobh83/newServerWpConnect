import type { Message as WbotMessage } from "whatsapp-web.js";
import Message from "../../models/Message";

const isMessageExistsService = async (msg: WbotMessage): Promise<boolean> => {
	const message = await Message.findOne({
		where: { messageId: msg?.id?.id },
	});

	if (!message) {
		return false;
	}

	return true;
};

export default isMessageExistsService;
