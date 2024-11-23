import { Whatsapp , create} from "@wppconnect-team/wppconnect";
import config from "../config/config";

interface Session extends Whatsapp {
    id: number;
    // requestPairingCode(phoneNumber: string): Promise<string>;
  }
  
  const sessions: Session[] = [];

  export const initWbot = async (whatsapp: Whatsapp): Promise<Session> => {
    return  new Promise((resolve, reject) => {
        try {
           
            const wbot = create(
                Object.assign({},
                    config.createOptions,
                    {
                        session: "renato"
                    }
                )
            ) as unknown as Session
            sessions.push(wbot)
            console.log(sessions)
            resolve(wbot)
        } catch (error) {
            
        }
     })
   }

   export const getWbot = (whatsappId: number): Session => {
    const sessionIndex = sessions.findIndex((s) => s.id === Number(whatsappId));
    if (sessionIndex === -1) {
      throw new Error("ERR_WAPP_NOT_INITIALIZED");
    }
  
    return sessions[sessionIndex];
  };