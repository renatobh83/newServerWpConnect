import { Message, Whatsapp } from "@wppconnect-team/wppconnect";
import {isValidMsg} from "./IsValidMsg"

interface Session extends Whatsapp {
  id: number;
}

export const HandleMessageEnviada = async (
  msg: Message,
  wbot: Session
): Promise<void> => {
return new Promise(async (resolve, reject)=>{
  try {
    if (!isValidMsg(msg)) {
      return;
    }
    // const chats = await wbot.getAllChats()
    // console.log(chats)
    resolve()
  } catch (error) {
    console.log(error,"HandleMessageEnviada")
    reject(error);
  }
  
})
}