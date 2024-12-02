import type { Ack, IncomingCall, Message, Whatsapp } from '@wppconnect-team/wppconnect';
import { HandleMessage } from './Helpers/HandleMessage';
import HandleMsgAck from './Helpers/HandleMsgAck';
import { HandleMsgReaction } from './Helpers/HandleMsgReaction';
import { VerifyCall } from './VerifyCall';

interface Session extends Whatsapp {
	id: number;
}

export interface MessageReaction {
	id: string;
	msgId: string;
	reactionText: string;
	read: boolean;
	orphan: number;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	orphanReason: any;
	timestamp: number;
}
export const wbotMessageListener = (wbot: Session): void => {
	wbot.onAnyMessage(async (msg: Message) => {
		if (msg.chatId === 'status@broadcast') return;
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
	// wbot.onLiveLocation((liveLocationEvent: LiveLocation) => {});
};
