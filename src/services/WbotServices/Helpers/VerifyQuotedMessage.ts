import { Message } from "@wppconnect-team/wppconnect";



const VerifyQuotedMessage = async (
  msg: Message
): Promise<Message | null> => {
//   if (!msg.quotedMsgId) return null;

  const wbotQuotedMsg = await msg.quotedMsgId;
   
//   const quotedMsg = await Message.findOne({
//     where: { messageId: wbotQuotedMsg.id.id }
//   });

//   if (!quotedMsg) return null;

//   return quotedMsg;
return wbotQuotedMsg
};

export default VerifyQuotedMessage;