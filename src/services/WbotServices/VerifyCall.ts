import type { IncomingCall, Whatsapp } from "@wppconnect-team/wppconnect";

interface Session extends Whatsapp {
	id: number;
}

export const VerifyCall = async (
	call: IncomingCall,
	wbot: Session,
): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		try {
			const messageDefault =
				"As chamadas de voz e vídeo estão desabilitas para esse WhatsApp, favor enviar uma mensagem de texto.";

			let settings: any;

			//   const rejectCalls =
			//   settings.find((s: {key: string}) => s.key === "rejectCalls")?.value === "enabled" ||
			//   false;

			wbot.rejectCall(call.id);

			if (!call.peerJid) return;

			wbot.sendText(call.peerJid, messageDefault);
		} catch (error) {
			reject(error);
		}
	});
};
