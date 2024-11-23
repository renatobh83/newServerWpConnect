import { Contact, Message } from "@wppconnect-team/wppconnect";
import VerifyQuotedMessage from "./VerifyQuotedMessage";

export const VerifyMediaMessage = async ( msg: Message,
    contact: Contact) =>{
       await VerifyQuotedMessage(msg)
    }