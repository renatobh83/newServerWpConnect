import { Whatsapp, create } from "@wppconnect-team/wppconnect";
import config from "../config/config";
import { WhatsAppServer } from "../types/WhatsAppServer";
import { wbotMessageListener } from "../services/WbotServices/wbotMessageListener";

interface Session extends Whatsapp {
    id: number;
    // requestPairingCode(phoneNumber: string): Promise<string>;
}

const sessions: Session[] = [];
const exportPhoneCode = (
    _req: any,
    _phone: any,
    _phoneCode: any,
    _client: WhatsAppServer,
    _res?: any
) => {
    // eventEmitter.emit(`phoneCode-${client.session}`, phoneCode, client);

    // Object.assign(client, {
    //   status: 'PHONECODE',
    //   phoneCode: phoneCode,
    //   phone: phone,
    // });

    // req.io.emit('phoneCode', {
    //   data: phoneCode,
    //   phone: phone,
    //   session: client.session,
    // });

    // callWebHook(client, req, 'phoneCode', {
    //   phoneCode: phoneCode,
    //   phone: phone,
    //   session: client.session,
    // });

    // if (res && !res._headerSent)
    //   res.status(200).json({
    //     status: 'phoneCode',
    //     phone: phone,
    //     phoneCode: phoneCode,
    //     session: client.session,
    //   });
}

export const initWbot = async (whatsapp: any): Promise<Session> => {

    try {
        const wbot = await create(
        
            Object.assign({},
                { tokenStore: "asdasdasdajwiewnnewiew" },
                config.createOptions,
                {
                    session: `wbot-${whatsapp.id}`,
                    phoneNumber: whatsapp.wppUser ?? null,
                    catchLinkCode: (_code: string) => { },
                    catchQR: (_asciiQR: any, _base64Qr: any, attempt: number, urlCode?: string) => {
                        console.log(urlCode)
                    },
                    statusFind: (statusSession:string, session:string) => {
                        console.log(statusSession)
                    },
                
                    logQR: true
                }
            )
        ) as unknown as Session

        const sessionIndex = sessions.findIndex((s) => s.id === whatsapp.id);
        if (sessionIndex === -1) {
            wbot.id = whatsapp.id;
            sessions.push(wbot);
        }
        start(wbot)
        return wbot
    } catch (error) {
        throw new Error("erro")
    }

}
const start = async (client: Session) => {
   try {
    const isReady = await client.isConnected();
    console.log('is', isReady)
    wbotMessageListener(client);
   } catch (error) {
    console.log(error,"start")
   }
}
export const getWbot = (whatsappId: number): Session => {
    const sessionIndex = sessions.findIndex((s) => s.id === Number(whatsappId));
    if (sessionIndex === -1) {
        throw new Error("ERR_WAPP_NOT_INITIALIZED");
    }

    return sessions[sessionIndex];
};