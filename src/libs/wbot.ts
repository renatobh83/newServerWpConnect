import fs from "node:fs";
import path, { resolve } from "node:path";
import { type Whatsapp, create } from "@wppconnect-team/wppconnect";
import { SenderLayer } from "@wppconnect-team/wppconnect/dist/api/layers/sender.layer";
import config from "../config/config";
import { wbotMessageListener } from "../services/WbotServices/wbotMessageListener";
import type { WhatsAppServer } from "../types/WhatsAppServer";
import { logger } from "../utils/logger";
import { getIO } from "./scoket";
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
	_res?: any,
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
};
export const initWbot = async (whatsapp: any): Promise<Session> => {
	let wbot: Session;
	const qrCodePath = path.join(
		__dirname,
		"..",
		"..",
		"public",
		`qrCode-${whatsapp.id}.png`,
	);
	try {
		// Criar uma nova sessão
		const io = getIO();

		wbot = (await create(
			Object.assign({}, { headless: false }, config.createOptions, {
				//  logger: logger,
				whatsappVersion: "2.3000.10184x",
				session: `wbot-${whatsapp.id}`,
				phoneNumber: whatsapp.wppUser ?? null,
				catchLinkCode: (_code: string) => {
					// Método para código de pareamento
				},
				catchQR: (
					base64Qr: any,
					_asciiQR: any,
					attempt: number,
					urlCode?: string,
				) => {
					const matches = base64Qr.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
					if (!matches || matches.length !== 3) {
						throw new Error("Invalid input string");
					}

					const response = {
						type: matches[1],
						data: Buffer.from(matches[2], "base64"),
					};

					fs.writeFile(qrCodePath, response.data, "binary", (err) => {
						if (err) {
							console.error("Erro ao salvar QR Code:", err);
						} else {
						}
					});
					// io.emit(`${tenantId}:whatsappSession`, {
					//     action: "update",
					//     session: whatsapp,
					//   });
				},

				statusFind: async (statusSession: string, session: string) => {
					if (statusSession === "isLogged") {
					}
					if (statusSession === "qrReadFail") {
						// logger.error(
						//     `Session: ${sessionName}-AUTHENTICATION FAILURE :: ${msg}`
						//   );
						//   if (whatsapp.retries > 1) {
						//     await whatsapp.update({
						//       retries: 0,
						//       session: "",
						//     });
						//   }
						//   const retry = whatsapp.retries;
						//   await whatsapp.update({
						//     status: "DISCONNECTED",
						//     retries: retry + 1,
						//   });
						//   io.emit(`${tenantId}:whatsappSession`, {
						//     action: "update",
						//     session: whatsapp,
						//   });
					}
					if (
						statusSession === "autocloseCalled" ||
						statusSession === "desconnectedMobile"
					) {
					}
					if (statusSession === "inChat") {
						if (fs.existsSync(qrCodePath)) {
							fs.unlink(qrCodePath, () => {});
						}
					}
				},
				logQR: true,
			}),
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
		await wbot.setOnlinePresence(true);
		return wbot;
	} catch (error) {
		throw new Error(`Erro ao inicializar a sessão: ${error}`);
	}
};
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
		//   listResponse: {
		//     listType: 1,
		//     title: 'Test 1',
		//     description: 'Description 1',
		//     singleSelectReply: { selectedRowId: 'my_custom_id' }
		//   },
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

		if (isReady) {
			const wbotVersion = await client.getWAVersion();
			// client.checkNumberStatus()
			// console.log(await client.getProfilePicFromServer())
			wbotMessageListener(client);
		}
	} catch (error) {}
};
export const getWbot = (whatsappId: number): Session => {
	const sessionIndex = sessions.findIndex((s) => s.id === Number(whatsappId));
	if (sessionIndex === -1) {
		throw new Error("ERR_WAPP_NOT_INITIALIZED");
	}

	return sessions[sessionIndex];
};

// {
//     id: {
//       fromMe: true,
//       remote: '553185683733@c.us',
//       id: '3EB036122565E25AFC2787',
//       self: 'out',
//       _serialized: 'true_553185683733@c.us_3EB036122565E25AFC2787_out'
//     },
//     viewed: false,
//     body: 'Test 1\nDescription 1',
//     type: 'list_response',
//     t: 1732490001,
//     from: '553185683733@c.us',
//     to: '553185683733@c.us',
//     ack: 3,
//     isNewMsg: true,
//     star: false,
//     kicNotified: false,
//     isFromTemplate: false,
//     pollInvalidated: false,
//     isSentCagPollCreation: false,
//     latestEditMsgKey: null,
//     latestEditSenderTimestampMs: null,
//     quotedMsg: {
//       viewed: false,
//       type: 'list',
//       kicNotified: false,
//       isFromTemplate: false,
//       pollInvalidated: false,
//       isSentCagPollCreation: false,
//       mentionedJidList: [],
//       groupMentions: [],
//       isEventCanceled: false,
//       eventInvalidated: false,
//       isVcardOverMmsDocument: false,
//       isForwarded: false,
//       hasReaction: false,
//       disappearingModeInitiator: 'chat',
//       disappearingModeTrigger: 'chat_settings',
//       disappearingModeInitiatedByMe: false,
//       list: {
//         buttonText: 'Click here',
//         description: 'Choose one option',
//         listType: 1,
//         sections: [Array]
//       },
//       productHeaderImageRejected: false,
//       lastPlaybackProgress: 0,
//       isDynamicReplyButtonsMsg: false,
//       isCarouselCard: false,
//       parentMsgId: null,
//       isMdHistoryMsg: false,
//       stickerSentTs: 0,
//       isAvatar: false,
//       lastUpdateFromServerTs: 0,
//       invokedBotWid: null,
//       bizBotType: null,
//       botResponseTargetId: null,
//       botPluginType: null,
//       botPluginReferenceIndex: null,
//       botPluginSearchProvider: null,
//       botPluginSearchUrl: null,
//       botPluginSearchQuery: null,
//       botPluginMaybeParent: false,
//       botReelPluginThumbnailCdnUrl: null,
//       botMsgBodyType: null,
//       requiresDirectConnection: false,
//       bizContentPlaceholderType: null,
//       hostedBizEncStateMismatch: false,
//       senderOrRecipientAccountTypeHosted: false,
//       placeholderCreatedWhenAccountIsHosted: false
//     },
//     quotedStanzaID: '3EB0B3110BFBF6AD573F1B',
//     quotedRemoteJid: null,
//     quotedParticipant: '553185683733@c.us',
//     mentionedJidList: [],
//     groupMentions: [],
//     isEventCanceled: false,
//     eventInvalidated: false,
//     isVcardOverMmsDocument: false,
//     isForwarded: false,
//     hasReaction: false,
//     listResponse: {
//       listType: 1,
//       title: 'Test 1',
//       description: 'Description 1',
//       singleSelectReply: { selectedRowId: 'my_custom_id' }
//     },
//     productHeaderImageRejected: false,
//     lastPlaybackProgress: 0,
//     isDynamicReplyButtonsMsg: false,
//     isCarouselCard: false,
//     parentMsgId: null,
//     isMdHistoryMsg: false,
//     stickerSentTs: 0,
//     isAvatar: false,
//     lastUpdateFromServerTs: 0,
//     invokedBotWid: null,
//     bizBotType: null,
//     botResponseTargetId: null,
//     botPluginType: null,
//     botPluginReferenceIndex: null,
//     botPluginSearchProvider: null,
//     botPluginSearchUrl: null,
//     botPluginSearchQuery: null,
//     botPluginMaybeParent: false,
//     botReelPluginThumbnailCdnUrl: null,
//     botMsgBodyType: null,
//     requiresDirectConnection: false,
//     bizContentPlaceholderType: null,
//     hostedBizEncStateMismatch: false,
//     senderOrRecipientAccountTypeHosted: false,
//     placeholderCreatedWhenAccountIsHosted: false
//   }

// SenderLayer
// {
//     id: 'true_553185683733@c.us_3EB0B3110BFBF6AD573F1B_out',
//     viewed: false,
//     type: 'list',
//     t: 1732489994,
//     from: '553185683733@c.us',
//     to: '553185683733@c.us',
//     ack: 3,
//     isNewMsg: true,
//     star: false,
//     kicNotified: false,
//     isFromTemplate: false,
//     pollInvalidated: false,
//     isSentCagPollCreation: false,
//     latestEditMsgKey: null,
//     latestEditSenderTimestampMs: null,
//     mentionedJidList: [],
//     groupMentions: [],
//     isEventCanceled: false,
//     eventInvalidated: false,
//     isVcardOverMmsDocument: false,
//     isForwarded: false,
//     hasReaction: false,
//     disappearingModeInitiator: 'chat',
//     disappearingModeTrigger: 'chat_settings',
//     disappearingModeInitiatedByMe: false,
//     list: {
//       buttonText: 'Click here',
//       description: 'Choose one option',
//       listType: 1,
//       sections: [ [Object] ]
//     },
//     productHeaderImageRejected: false,
//     lastPlaybackProgress: 0,
//     isDynamicReplyButtonsMsg: false,
//     isCarouselCard: false,
//     parentMsgId: null,
//     isMdHistoryMsg: false,
//     stickerSentTs: 0,
//     isAvatar: false,
//     lastUpdateFromServerTs: 0,
//     invokedBotWid: null,
//     bizBotType: null,
//     botResponseTargetId: null,
//     botPluginType: null,
//     botPluginReferenceIndex: null,
//     botPluginSearchProvider: null,
//     botPluginSearchUrl: null,
//     botPluginSearchQuery: null,
//     botPluginMaybeParent: false,
//     botReelPluginThumbnailCdnUrl: null,
//     botMsgBodyType: null,
//     requiresDirectConnection: false,
//     bizContentPlaceholderType: null,
//     hostedBizEncStateMismatch: false,
//     senderOrRecipientAccountTypeHosted: false,
//     placeholderCreatedWhenAccountIsHosted: false,
//     chatId: '553185683733@c.us',
//     fromMe: true,
//     sender: {
//       id: '553185683733@c.us',
//       name: 'Renato Lucio De Mendonça',
//       shortName: 'Renato',
//       pushname: 'Renato Mendonca',
//       type: 'in',
//       isBusiness: false,
//       isEnterprise: false,
//       isSmb: false,
//       isContactSyncCompleted: 1,
//       textStatusLastUpdateTime: -1,
//       syncToAddressbook: true,
//       formattedName: 'You',
//       isMe: true,
//       isMyContact: true,
//       isPSA: false,
//       isUser: true,
//       isWAContact: true,
//       profilePicThumbObj: null,
//       msgs: null
//     },
//     timestamp: 1732489994,
//     isGroupMsg: false,
//     mediaData: {}
//   }
