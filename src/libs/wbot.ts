import { Whatsapp, create } from "@wppconnect-team/wppconnect";
import config from "../config/config";
import { WhatsAppServer } from "../types/WhatsAppServer";
import { wbotMessageListener } from "../services/WbotServices/wbotMessageListener";
import fs from 'node:fs'
import path from "node:path"
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

const filePath = ():string => { 
    const pathAbs = path.join(__dirname, "..", "..", 'public')
    const fullFilePath = path.join(pathAbs, "qrCode.png");
    return fullFilePath
}
// export const initWbot = async (whatsapp: any): Promise<Session> => {
//     let wbot: Session
//     try {
//         wbot = await create(
//             Object.assign({},
//                 {headless: true},
//                 config.createOptions,
//                  {  whatsappVersion:'2.3000.10184x',
//                     session: `wbot-${whatsapp.id}`,
//                     phoneNumber: whatsapp.wppUser ?? null,
//                     catchLinkCode: (_code: string) => { 
//                         // Metodo para codigo de pareamento
//                     },
//                     catchQR: (base64Qr: any,_asciiQR: any,  attempt: number, urlCode?: string) => {
//                         let matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
//                         let response: any = {};
                  
//                       if (matches.length !== 3) {
//                         return new Error('Invalid input string');
//                       }
//                       response.type = matches[1];
//                       response.data = Buffer.from(matches[2], 'base64') 

//                       var imageBuffer = response;
//                            fs.writeFile(filePath(),imageBuffer['data'],'binary',(err)=>console.log(err))
//                     },
//                     statusFind: (statusSession:string, session:string) => {
//                         if (
//                             statusSession === 'autocloseCalled' ||
//                             statusSession === 'desconnectedMobile'
//                           ) {
//                             // Metodo para informar que foi desconectado
//                           }
//                     },
//                     logQR: true
//                 }
//             )
//         ) as unknown as Session

//         const sessionIndex = sessions.findIndex((s) => s.id === whatsapp.id);
//         if (sessionIndex === -1) {
//             wbot.id = whatsapp.id;
//             sessions.push(wbot);
//         }
        
       
//         start(wbot)
//         return wbot
//     } catch (error) {
//         throw new Error(`erro  ${error}`)
//     }

// }
export const initWbot = async (whatsapp: any): Promise<Session> => {
    let wbot: Session;

    try {
        // Criar uma nova sessão
        wbot = (await create(
            Object.assign(
                {},
                { headless: true },
                config.createOptions,
                {
                    whatsappVersion: '2.3000.10184x',
                    session: `wbot-${whatsapp.id}`,
                    phoneNumber: whatsapp.wppUser ?? null,
                    catchLinkCode: (_code: string) => {
                        // Método para código de pareamento
                    },
                    catchQR: (base64Qr: any, _asciiQR: any, attempt: number, urlCode?: string) => {
                        const matches = base64Qr.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
                        if (!matches || matches.length !== 3) {
                            throw new Error('Invalid input string');
                        }

                        const response = {
                            type: matches[1],
                            data: Buffer.from(matches[2], 'base64'),
                        };

                        const qrCodePath = path.join(__dirname, '..', '..', 'public', `qrCode-${whatsapp.id}.png`);
                        fs.writeFile(qrCodePath, response.data, 'binary', (err) => {
                            if (err) {
                                console.error('Erro ao salvar QR Code:', err);
                            } else {
                                console.log('QR Code salvo com sucesso!');
                            }
                        });
                    },
                    statusFind: (statusSession: string, session: string) => {
                        if (statusSession === 'autocloseCalled' || statusSession === 'desconnectedMobile') {
                            console.log(`Sessão desconectada: ${session}`);
                        }
                    },
                    logQR: true,
                }
            )
        )) as unknown as Session;

        // Atualizar a lista de sessões
        const sessionIndex = sessions.findIndex((s) => s.id === whatsapp.id);
        if (sessionIndex === -1) {
            wbot.id = whatsapp.id;
            sessions.push(wbot);
        } else {
            sessions[sessionIndex] = wbot;
        }

        start(wbot);
        return wbot;
    } catch (error) {
        throw new Error(`Erro ao inicializar a sessão: ${error}`);
    }
}
const start = async (client: Session) => {
   try {
  
    const isReady = await client.isAuthenticated();
    
    // client.sendListMessage('553185683733@c.us',{
    //     buttonText: 'Click here',
    //     description: 'Choose one option',
    //     sections: [
    //       {
    //         title: 'Section 1',
    //         rows: [
    //           {
    //             rowId: 'my_custom_id',
    //             title: 'Test 1',
    //             description: 'Description 1',
    //           },
    //           {
    //             rowId: '2',
    //             title: 'Test 2',
    //             description: 'Description 2',
    //           },
    //         ],
    //       },
    //     ],
    //   }).then(result=> console.log(result))
    // client.sendText('553185683733@c.us', 'WPPConnect message with buttons', {
    //     useTemplateButtons: true, // False for legacy
    //     buttons: [
    //       {
    //         id: '1',
    //         text: 'WPPConnect Site'
    //       },
    //       {
    //         id: '2',
    //         text: 'WPPConnect Site'
    //       },
    //       {
    //         id: '3',
    //         text: 'WPPConnect Site'
    //       }
         
    //     ],
    //     title: 'Title text' // Optional
    
        
       
    //  }).then(result=> console.log(result))
   
    if(isReady)  {
        wbotMessageListener(client);
        fs.unlink(filePath(),()=>{
            console.log("qrCode apagado")
        })
    }
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