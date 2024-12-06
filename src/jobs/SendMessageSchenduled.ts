import SendMessagesSchenduleWbot from "../services/WbotServices/SendMessagesSchenduleWbot";
import { logger } from "../utils/logger";

export default {
	key: "SendMessageSchenduled",
	options: {
		removeOnComplete: true,
		removeOnFail: true,
		jobId: "SendMessageSchenduled",
		repeat: {
			every: 1 * 60 * 1000,
		},
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
