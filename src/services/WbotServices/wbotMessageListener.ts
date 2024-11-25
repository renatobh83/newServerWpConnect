import type {
	Ack,
	IncomingCall,
	LiveLocation,
	Message,
	Whatsapp,
} from "@wppconnect-team/wppconnect";
import { HandleMessage } from "./Helpers/HandleMessage";
import { VerifyCall } from "./VerifyCall";

interface Session extends Whatsapp {
	id: number;
}

interface ReactionMessage {
	id: string;
	msgId: string;
	reactionText: string;
	read: boolean;
	orphan: number;
	orphanReason: any;
	timestamp: number;
}
export const wbotMessageListener = (wbot: Session): void => {
	wbot.onAnyMessage(async (msg: Message) => {
		if (msg.chatId === "status@broadcast") return;
		await HandleMessage(msg, wbot);
	});

	wbot.onIncomingCall(async (call: IncomingCall) => {
		VerifyCall(call, wbot);
	});

	wbot.onReactionMessage((reaction: ReactionMessage) => {});
	wbot.onAck((ack: Ack) => {});
	wbot.onLiveLocation((liveLocationEvent: LiveLocation) => {});
};
