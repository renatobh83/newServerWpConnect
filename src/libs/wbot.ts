import { Whatsapp , create} from "@wppconnect-team/wppconnect";
import config from "../confg/config";

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
                        sessions: "renato"
                    }
                )
            ) as unknown as Session
            resolve(wbot)
        } catch (error) {
            
        }
     })
   }