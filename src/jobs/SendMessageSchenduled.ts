import SendMessagesSchenduleWbot from "../services/WbotServices/SendMessagesSchenduleWbot";
import { logger } from "../utils/logger";

export default {
	key: "SendMessageSchenduled",
	options: {
		removeOnComplete: true,
		removeOnFail: true,
	},
	async handle() {
		try {
			logger.info("SendMessageSchenduled Initiated");
			await SendMessagesSchenduleWbot();
			logger.info("Finalized SendMessageSchenduled");
		} catch (error) {
			logger.error({ message: "Error send messages", error });
		}
	},
};
