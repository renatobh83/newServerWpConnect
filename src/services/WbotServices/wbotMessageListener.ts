import { Message, Whatsapp } from "@wppconnect-team/wppconnect";
import { HandleMessageEnviada } from "./Helpers/HandleMessage";

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
        
        if(!msg.fromMe) return
        
        
        await HandleMessageEnviada(msg, wbot)
    })
    wbot.onMessage((msg)=>{
        console.log("Recebida")
    })
   
    wbot.onIncomingCall(async (call)=> {
        console.log(call)
        await wbot.rejectCall(call.id)
    })

    wbot.onReactionMessage(({id, msgId,orphan,orphanReason,reactionText,read,timestamp}:ReactionMessage)=> {
        console.log(id, msgId,orphan,orphanReason,reactionText,read,timestamp)
    })
}
