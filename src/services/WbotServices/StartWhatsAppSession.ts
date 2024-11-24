import { getIO } from "../../libs/scoket"
import { initWbot } from "../../libs/wbot";
export const StartWhatsAppSession = async (
    whatsapp: any
  ): Promise<void> => { 
    // await whatsapp.update({ status: "OPENING" });
   
    const io = getIO()
    io.emit(`${whatsapp.tenantId}:whatsappSession`, {
        action: "update",
        session: whatsapp,
      });
    try {
        if (whatsapp.type === "whatsapp") {
            const wbot = await initWbot(whatsapp);
            // wbotMonitor(wbot, whatsapp);
          }
    } catch (error) {
        console.log(error)
    }
  }
