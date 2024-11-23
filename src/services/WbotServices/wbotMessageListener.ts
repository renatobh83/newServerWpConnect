import type{ IncomingCall, Message, Whatsapp } from "@wppconnect-team/wppconnect";
import { HandleMessage } from "./Helpers/HandleMessage";


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
   
    wbot.onAnyMessage(async(msg: Message)=> {
        if (msg.chatId ==="status@broadcast") return
        await HandleMessage(msg, wbot)
    })
  
   
    wbot.onIncomingCall(async (call: IncomingCall)=> {
        console.log(call)
       
        await wbot.rejectCall(call.id)
    })

    wbot.onReactionMessage((reaction:ReactionMessage)=> {
        
       
    })
}
