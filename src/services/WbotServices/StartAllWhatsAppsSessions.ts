import { StartWhatsAppSession } from "./StartWhatsAppSession";

export const StartAllWhatsAppsSessions = async (): Promise<void> => {
    const whatsapp =  [{
        id: 34343,
        type: "whatsapp"
    }]

    const whatsappSessions = whatsapp.filter((w) => w.type === "whatsapp");
    if (whatsappSessions.length > 0) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        whatsappSessions.forEach((whatsapp) => {
          StartWhatsAppSession(whatsapp);
        });
      }
 }
