import {
	AckType,
	InterfaceMode,
	InterfaceState,
	PresenceEvent,
	type Ack,
	type IncomingCall,
	type Message,
	type Whatsapp,
} from "@wppconnect-team/wppconnect";
import { HandleMessage } from "./Helpers/HandleMessage";
// import HandleMsgAck from "./Helpers/HandleMsgAck";
import { HandleMsgReaction } from "./Helpers/HandleMsgReaction";
import { VerifyCall } from "./VerifyCall";
import HandleMsgAck from "./Helpers/HandleMsgAck";

interface Session extends Whatsapp {
	id: number;
}

export interface MessageReaction {
	id: string;
	msgId: string;
	reactionText: string;
	read: boolean;
	orphan: number;
	orphanReason: any;
	timestamp: number;
}
interface MessageChange extends Message {
	filename: string
}
export const wbotMessageListener = async (wbot: Session): Promise<void> => {
	wbot.onAnyMessage(async (msg: MessageChange) => {
		if (msg.chatId === "status@broadcast") return;
		await HandleMessage(msg, wbot);
	});

	wbot.onIncomingCall(async (call: IncomingCall) => {
		VerifyCall(call, wbot);
	});

	wbot.onReactionMessage((msg: MessageReaction) => {
		HandleMsgReaction(msg);
	});
	wbot.onAck((ack: Ack) => {
		HandleMsgAck(ack);
	});

	wbot.onRevokedMessage((msg) => {
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		console.log(msg);
	});
	// wbot.onLiveLocation((liveLocationEvent: LiveLocation) => {});
};
