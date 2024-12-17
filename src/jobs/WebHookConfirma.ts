/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from "../utils/logger";

import Confirmacao from "../models/Confirmacao";
import { confirmaExame, getPreparos } from "../api/Genesis/helpers/ActionsApi";
import SendPreparoExame from "../api/Genesis/services/wbot/SendPreparoExame";

interface Data {
	idexterno: number[];
	procedimentos: number[];
	tenantId: string;
	contatoSend: string;
}


export default {
	key: "WebHookConfirma",
	options: {
		delay: 6000,
		attempts: 5,
		// backoff: {
		//   type: "fixed",
		//   delay: 60000 * 3 // 3 min
		// }
	},
	async handle(data: Data) {
		try {
			const msgConfirmacao = await Confirmacao.findOne({
				where: {
					tenantId: Number(data.tenantId),
					contatoSend: data.contatoSend,
				},
			});

			function isBase64Meaningful(base64) {
				// Decodifica e mede o tamanho do conteúdo base64
				const decodedContent = Buffer.from(base64, "base64");
				const minSize = 200; // Define 200 bytes como tamanho mínimo para conteúdo relevante
				return decodedContent.length >= minSize;
			}

			let responseSendMessage: any;

			const confirmacao = data.idexterno.map(async id => {
				try {
					// Aguarda a confirmação do exame
					const result = await confirmaExame(Number(data.tenantId), id);

					return result
				} catch (error) {
					// Captura e retorna erros para análise posterior
					return error
				}
			});
			const preparos = data.procedimentos.map(async (id) => {
				try {
					const result = await getPreparos({ tenantId: +data.tenantId, procedimento: id })

					return result
				} catch (error) {
					// Captura e retorna erros para análise posterior

				}
			})
			const retornoPreparo = await Promise.allSettled(preparos);
			const retornoConfirmacao = await Promise.allSettled(confirmacao);
			// // Verifique se todas as promessas foram resolvidas com sucesso
			const allFulfilled = retornoConfirmacao.every(
				(result) => result.status === "fulfilled",
			);
			if (allFulfilled) {
				msgConfirmacao.status = "CONFIRMADO";
				await msgConfirmacao.save();
				// Extraia os valores dos preparos
				responseSendMessage = retornoPreparo
					.filter((result) => result.status === "fulfilled")
					.filter((result) => isBase64Meaningful(result.value)) // Filtra apenas resultados onde base64 não está vazio
					.map(async (result) => {
						return await SendPreparoExame({
							msgConfirmacao,
							base64Html: result.value,
							sendTo: data.contatoSend,
						});
					});
			}

			logger.info(`Queue WebHooksAPI success: Data: ${responseSendMessage}`);
			return true;
		} catch (error) {
			logger.error(`Error send message confirmacao response: ${error}`);
		}
	},
};
