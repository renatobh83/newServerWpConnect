/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from "../utils/logger";

interface Data {
	idexterno: number[];
	procedimentos: number[];
	tenantId: string;
}

export default {
	key: "WebHookCancela",
	options: {
		delay: 6000,
		attempts: 5,
		// backoff: {
		//   type: "fixed",
		//   delay: 60000 * 3 // 3 min
		// }
	},
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	async handle({ idexterno, procedimentos, tenantId }: Data) {
		try {
			logger.info("Queue WebHooksAPI success: Data:");
			return true;
		} catch (error) {
			logger.error(`Error send message confirmacao response: ${error}`);
			if (error?.response?.status === 404) {
				return { message: "url configurar no webhook não existe." };
			}
			throw new Error(error);
		}
	},
};
