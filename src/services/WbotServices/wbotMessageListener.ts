import type{ Ack, IncomingCall, LiveLocation, Message, Whatsapp } from "@wppconnect-team/wppconnect";
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
   
    wbot.onAnyMessage(async(msg: Message)=> {
        if (msg.chatId ==="status@broadcast") return
        await HandleMessage(msg, wbot)
    })
  
   
    wbot.onIncomingCall(async (call: IncomingCall)=> {      
        VerifyCall(call, wbot) 
    })

    wbot.onReactionMessage((reaction:ReactionMessage)=> {
    
    })
    wbot.onAck((ack: Ack)=> {
        // MD_DOWNGRADE = -7,
        // INACTIVE = -6,
        // CONTENT_UNUPLOADABLE = -5,
        // CONTENT_TOO_BIG = -4,
        // CONTENT_GONE = -3,
        // EXPIRED = -2,
        // FAILED = -1,
        // CLOCK = 0,
        // SENT = 1,
        // RECEIVED = 2,
        // READ = 3,
        // PLAYED = 4,
        console.log(ack)
        
    })
    wbot.onLiveLocation((liveLocationEvent: LiveLocation)=>{
        
    })
}
