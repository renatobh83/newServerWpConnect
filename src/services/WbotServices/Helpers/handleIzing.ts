// var __awaiter =
//   (this && this.__awaiter) ||
//   function (thisArg, _arguments, P, generator) {
//     function adopt(value) {
//       return value instanceof P ? value : new P(function (resolve) { resolve(value); });
//     }
//     return new (P || (P = Promise))(function (resolve, reject) {
//       function fulfilled(value) {
//         try {
//           step(generator.next(value));
//         } catch (e) {
//           reject(e);
//         }
//       }
//       function rejected(value) {
//         try {
//           step(generator["throw"](value));
//         } catch (e) {
//           reject(e);
//         }
//       }
//       function step(result) {
//         result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
//       }
//       step((generator = generator.apply(thisArg, _arguments || [])).next());
//     });
//   };

// var __importDefault =
//   (this && this.__importDefault) ||
//   function (mod) {
//     return mod && mod.__esModule ? mod : { default: mod };
//   };

// const obj = {};
// obj.value = true;
// Object.defineProperty(exports, "__esModule", obj);

// const logger = require('../../../utils/logger');
// const findOrCreateTicketService = __importDefault(require('../../TicketServices/FindOrCreateTicketService'));
// const showWhatsAppService = __importDefault(require('../../WhatsappService/ShowWhatsAppService'));
// const isValidMsg = __importDefault(require('./IsValidMsg'));
// const verifyContact = __importDefault(require('./VerifyContact'));
// const verifyMediaMessage = __importDefault(require('./VerifyMediaMessage'));
// const verifyMessage = __importDefault(require('./VerifyMessage'));
// const verifyBusinessHours = __importDefault(require('./VerifyBusinessHours'));
// const handleMessageChatGpt = __importDefault(require('./HandleMessageChatGpt'));
// const handleMessageTypebot = __importDefault(require('./HandleMessageTypebot'));
// const handleMessageDialogflow = __importDefault(require('./HandleMessageDialogflow'));
// const verifyStepsChatFlowTicket = __importDefault(require('../../ChatFlowServices/VerifyStepsChatFlowTicket'));
// const socketEmit = __importDefault(require('../../../helpers/socketEmit'));
// const showTicketService = __importDefault(require('../../TicketServices/ShowTicketService'));
// const Queue = __importDefault(require('../../../libs/Queue'));
// const Contact = __importDefault(require('../../../models/Contact'));
// const Setting = __importDefault(require('../../../models/Setting'));
// const TicketEvaluation = __importDefault(require('../../../models/TicketEvaluation'));
// const Whatsapp = __importDefault(require('../../../models/Whatsapp'));
// const WordList = __importDefault(require('../../../models/WordList'));
// const Message = __importDefault(require('../../../models/Message'));
// const GroupChat = __importDefault(require('whatsapp-web.js/src/structures/GroupChat'));
// const request = __importDefault(require('request'));
// const ChatFlow = __importDefault(require('../../../models/ChatFlow'));
// const User = __importDefault(require('../../../models/User'));
// const Ticket = __importDefault(require('../../../models/Ticket'));
// const sequelize = require('sequelize');
// const TranscribeAudio = require('../../../helpers/TranscribeAudio');
// const path = __importDefault(require('path'));
// const createMessageSystemService = __importDefault(require('../../MessageServices/CreateMessageSystemService'));
// const handleMessageDify = __importDefault(require('./HandleMessageDify'));


// const whatsAppFilter = { id: whatsApp.id };
// const whatsAppDetails = yield showWhatsAppService(whatsAppFilter);
// const { tenantId } = whatsAppDetails;
// const chatDetails = yield message.getChat();

// if (message.fromMe) {
//   const contact = yield Contact.findOne({
//     where: {
//       number: message.to.replace(/\D/g, ''),
//       tenantId: tenantId,
//     },
//   });

//   if (contact?.blocked) {
//     return;
//   }
// }
// if (!message.fromMe) {
//   const contact = yield Contact.findOne({
//     where: {
//       number: message.from.replace(/\D/g, ''),
//       tenantId: tenantId,
//     },
//   });

//   if (contact?.blocked) {
//     return;
//   }
// }
// if (message.fromMe) {
//   const forbiddenNumbersFilter = {
//     key: 'forbiddenNumbers',
//     tenantId: tenantId,
//   };
//   const findOneOptions = { where: forbiddenNumbersFilter };
//   const forbiddenNumbersSetting = yield Setting.findOne(findOneOptions);

//   if (forbiddenNumbersSetting && forbiddenNumbersSetting.value) {
//     const forbiddenNumbers = forbiddenNumbersSetting.value.split(',');
//     const messageToNumber = message.to.replace(/\D/g, '');

//     if (forbiddenNumbers.includes(messageToNumber)) {
//       logger.info(`::: Z-PRO ::: ZDG ::: Number ${messageToNumber} forbidden.`);
//       return;
//     }
//   }
// }
// if (!message.fromMe) {
//   const forbiddenNumbersFilter = {
//     key: 'forbiddenNumbers',
//     tenantId: tenantId,
//   };
//   const findOneOptions = { where: forbiddenNumbersFilter };
//   const forbiddenNumbersSetting = yield Setting.findOne(findOneOptions);

//   if (forbiddenNumbersSetting && forbiddenNumbersSetting.value) {
//     const forbiddenNumbers = forbiddenNumbersSetting.value.split(',');
//     const messageFromNumber = message.from.replace(/\D/g, '');

//     if (forbiddenNumbers.includes(messageFromNumber)) {
//       logger.info(`::: Z-PRO ::: ZDG ::: Number ${messageFromNumber} forbidden.`);
//       return;
//     }
//   }
// }
// function delay(ms, value) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve.bind(null, value), ms);
//   });
// }
// const n8nFilter = {
//   key: 'n8n',
//   tenantId: tenantId,
// };
// const findOneOptionsN8n = { where: n8nFilter };
// const n8nSetting = yield Setting.findOne(findOneOptionsN8n);

// const dialogflowFilter = {
//   key: 'dialogflow',
//   tenantId: tenantId,
// };
// const findOneOptionsDialogflow = { where: dialogflowFilter };
// const dialogflowSetting = yield Setting.findOne(findOneOptionsDialogflow);

// const difyFilter = {
//   key: 'dify',
//   tenantId: tenantId,
// };
// const findOneOptionsDify = { where: difyFilter };
// const difySetting = yield Setting.findOne(findOneOptionsDify);

// const chatgptFilter = {
//   key: 'chatgpt',
//   tenantId: tenantId,
// };
// const findOneOptionsChatgpt = { where: chatgptFilter };
// const chatgptSetting = yield Setting.findOne(findOneOptionsChatgpt);
// const typebotFilter = {
//   key: 'typebot',
//   tenantId: tenantId,
// };
// const findOneOptionsTypebot = { where: typebotFilter };
// const typebotSetting = yield Setting.findOne(findOneOptionsTypebot);


// function sendWebhookMessage(message, tenantId, ticket) {
//   return __awaiter(this, void 0, void 0, function* () {
//     const webhookMessageFilter = {
//       key: 'webhookMessage',
//       tenantId: tenantId,
//     };
//     const findOneOptionsMessage = { where: webhookMessageFilter };
//     const webhookMessageSetting = yield Setting.findOne(findOneOptionsMessage);

//     if (webhookMessageSetting && webhookMessageSetting.value === 'enabled') {
//       try {
//         const webhookFilter = {
//           key: 'webhook',
//           tenantId: tenantId,
//         };
//         const findOneOptionsWebhook = { where: webhookFilter };
//         const webhookSetting = yield Setting.findOne(findOneOptionsWebhook);

//         if (webhookSetting && webhookSetting.value === 'enabled') {
//           const webhookUrlFilter = {
//             key: 'webhookUrl',
//             tenantId: tenantId,
//           };
//           const findOneOptionsUrl = { where: webhookUrlFilter };
//           const webhookUrlSetting = yield Setting.findOne(findOneOptionsUrl);

//           if (webhookUrlSetting) {
//             const method = 'message';
//             const payload = {
//               method: method,
//               msg: message,
//               ticket: ticket,
//             };
//             const requestOptions = {
//               method: 'POST',
//               url: webhookUrlSetting.value,
//               headers: {
//                 'Content-Type': 'application/json'
//               },
//               json: payload,
//             };

//             request(requestOptions, function (error, response) {
//               if (error) {
//                 throw new Error(error.message);
//               } else {
//                 logger.info('::: Z-PRO ::: ZDG ::: Webhook da mensagem enviado com sucesso.');
//               }
//             });
//           } else {
//             logger.info("::: Z-PRO ::: ZDG ::: Configuração 'webhookUrl' não encontrada para mensagem.");
//           }
//         }
//       } catch (error) {
//         logger.info('::: Z-PRO ::: ZDG ::: Ocorreu um erro:', error);
//       }
//     }
//   });
// }
// function sendN8NWebhook(message, media, ticket) {
//   return __awaiter(this, void 0, void 0, function* () {
//     try {
//       const method = 'message';
//       const payload = {
//         method: method,
//         msg: message,
//         media: media,
//         ticket: ticket,
//       };
//       const requestOptions = {
//         method: 'POST',
//         url: config.n8nUrl,
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         json: payload,
//       };

//       request(requestOptions, function (error, response) {
//         if (error) {
//           throw new Error(error.message);
//         } else {
//           logger.info('::: Z-PRO ::: ZDG ::: Webhook da mensagem enviado com sucesso.');
//         }
//       });
//     } catch (error) {
//       logger.info('::: Z-PRO ::: ZDG ::: Ocorreu um erro:', error);
//     }
//   });
// }
// const ignoreGroupMsgFilter = {
//   key: 'ignoreGroupMsg',
//   tenantId: tenantId,
// };
// const findOneOptions = { where: ignoreGroupMsgFilter };
// const ignoreGroupMsgSetting = yield Setting.findOne(findOneOptions);

// if (
//   (ignoreGroupMsgSetting?.value) === 'enabled' &&
//   (chatDetails.isGroup || message.from === 'status@broadcast')
// ) {
//   return;
// }
// try {
//   let contact, groupContact;

// if (message.fromMe) {
//   if (
//     !message.hasMedia &&
//     message.type !== 'chat' &&
//     message.type !== 'vcard' &&
//     message.type !== 'location'
//   ) {
//     return;
//   }
//   contact = yield whatsapp.getContactById(message.to);
// } else {
//   contact = yield message.getContact();
// }

// if (chatDetails.isGroup) {
//   let groupContact;
//   if (message.fromMe) {
//     groupContact = yield whatsapp.getContactById(message.to);
//   } else {
//     groupContact = yield whatsapp.getContactById(message.from);
//   }

//   groupContact = yield verifyContact(groupContact, tenantId);

//   const whatsappFilter = { id: whatsapp.id };
//   const findOneOptions = { where: whatsappFilter };
//   const whatsappDetails = yield Whatsapp.findOne(findOneOptions);

//   if (whatsappDetails && whatsappDetails.wordList === 'enabled') {
//     const chat = yield whatsapp.getChatById(message.id.remote);
//     const wordListFilter = { groupId: message.id.remote };
//     const findAllOptions = { where: wordListFilter };
//     const wordList = yield WordList.findAll(findAllOptions);

//     const filteredWords = wordList.filter((word) => {
//       return message.body.toLowerCase().includes(word.word.toLowerCase());
//     });

//     if (filteredWords.length > 0) {
//       if (chat instanceof GroupChat) {
//         for (const participant of chat.participants) {
//           if (participant.id._serialized === message.author && !participant.isAdmin) {
//             try {
//               yield message.delete(true);
//               const msg = yield Message.findByPk(message.id.id);
//               if (!msg) {
//                 return;
//               }
//               yield msg.destroy();
//             } catch (error) {
//               logger.warn('::: Z-PRO ::: ZDG ::: Error deleting message. Err: ' + error);
//             }
//           }
//         }
//       }
//     }
//   }
// }
// const unreadMessagesCount = message.fromMe ? 0 : chat.unreadCount + 1;
// const verifiedContact = yield verifyContact(contact, tenantId);

// const ticketDetails = {
//   contact: verifiedContact,
//   whatsappId: whatsapp.id,
//   unreadMessages: unreadMessagesCount,
//   tenantId: tenantId,
//   groupContact: groupContact,
//   msg: message,
//   channel: 'whatsapp',
// };

// const ticket = yield findOrCreateTicketService(ticketDetails);
// yield sendWebhookMessage(message, tenantId, ticket);
// if (ticket?.isCampaignMessage) {
//   completeProcessing();
//   return;
// }

// if (ticket?.isFarewellMessage) {
//   completeProcessing();
//   return;
// }
// if (config.selfDistribute === 'enabled') {
//   if (ticket.status === 'pending' && !ticket.userId) {
//     try {
//       const onlineUserFilter = {
//         tenantId: config.tenantId,
//         isOnline: true,
//       };
//       const findAllOptions = { where: onlineUserFilter };
//       const onlineUsers = yield User.findAll(findAllOptions);

//       let selectedUser = null;
//       let minTicketsCount = Infinity;

//       for (const user of onlineUsers) {
//         if (user.profile !== 'superadmin') {
//           const userTicketsCount = yield Ticket.count({
//             where: {
//               userId: user.id,
//               isGroup: false,
//               createdAt: {
//                 [Op.gte]: new Date().setHours(0, 0, 0, 0),
//                 [Op.lt]: new Date().setHours(23, 59, 59, 999),
//               },
//             },
//           });

//           if (userTicketsCount < minTicketsCount) {
//             minTicketsCount = userTicketsCount;
//             selectedUser = user;
//           }
//         }
//       }

//       if (selectedUser) {
//         const updateData = { userId: selectedUser.id };
//         yield ticket.update(updateData);
//         logger.info(`::: Z-PRO ::: ZDG ::: User ${selectedUser.id} set to ticket ${ticket.id} by selfDistribute`);
//       }
//     } catch (error) {
//       logger.warn('::: Z-PRO ::: ZDG ::: selfDistribute error', error);
//     }
//   }
// }
// const evaluationFilter = {
//   ticketId: ticket.id,
//   tenantId: tenantId,
// };
// const findOneOptions = {
//   where: evaluationFilter,
//   order: [['createdAt', 'DESC']],
// };
// const latestEvaluation = yield TicketEvaluation.findOne(findOneOptions);

// if (!message.fromMe && latestEvaluation && latestEvaluation.attempts < 2 && !['0', '1', '2', '3', '4', '5'].includes(message.body)) {
//   yield TicketEvaluation.update(
//     { attempts: latestEvaluation.attempts + 1 },
//     { where: { id: latestEvaluation.id } }
//   );

//   if (latestEvaluation.attempts + 1 === 1) {
//     yield whatsapp.sendMessage(
//       message.from,
//       'Você tem mais uma oportunidade para avaliar esse atendimento enviando um número de 0 a 5.\nSe uma mensagem com valor diferente ao solicitado for enviada, a sua avaliação não será gravada.'
//     );
//   } else {
//     yield whatsapp.sendMessage(
//       message.from,
//       'Não foi possível armazenar sua avaliação.'
//     );
//   }
// }
// if (
//   !message.fromMe &&
//   latestEvaluation &&
//   latestEvaluation.attempts < 2 &&
//   ['0', '1', '2', '3', '4', '5'].includes(message.body)
// ) {
//   yield whatsapp.sendMessage(
//     message.from,
//     'Sua avaliação foi armazenada com sucesso.'
//   );

//   try {
//     const successMessage = {
//       body: 'Sua avaliação foi armazenada com sucesso.',
//       fromMe: true,
//       read: true,
//     };
//     const messageDetails = {
//       msg: successMessage,
//       tenantId: tenantId,
//       ticket: ticket,
//       userId: ticket.userId,
//       sendType: 'evaluation',
//       status: 'sended',
//     };
//     yield createMessageSystemService(messageDetails);
//   } catch (error) {
//     logger.info(
//       '::: Z-PRO ::: ZDG ::: try CreateMessageSystemServiceTranscription',
//       error
//     );
//   }

//   const evaluationUpdate = {
//     evaluation: message.body,
//     attempts: 2,
//   };
//   const updateCondition = { id: latestEvaluation.id };
//   yield TicketEvaluation.update(evaluationUpdate, { where: updateCondition });

//   yield ticket.update({ status: 'closed' });

//   const ticketServiceParams = {
//     id: ticket.id,
//     tenantId: tenantId,
//   };
//   const updatedTicket = yield showTicketService(ticketServiceParams);

//   const socketPayload = {
//     tenantId: tenantId,
//     type: 'ticket:update',
//     payload: updatedTicket,
//   };
//   socketEmit(socketPayload);

//   return;
// }
// if (
//   (difySetting?.value) === 'enabled' &&
//   !message.fromMe &&
//   !chatDetails.isGroup
// ) {
//   try {
//     yield handleMessageDify(whatsapp, message, ticket);
//   } catch (error) {
//     logger.warn('::: Z-PRO ::: ZDG ::: HandleMessageDify', error);
//   }
// }

// if (
//   (chatgptSetting?.value) === 'enabled' &&
//   !message.fromMe &&
//   !chatDetails.isGroup
// ) {
//   try {
//     yield handleMessageChatGpt(whatsapp, message, ticket);
//   } catch (error) {
//     logger.warn('::: Z-PRO ::: ZDG ::: HandleMessageChatGpt', error);
//   }
// }

// if (
//   (typebotSetting?.value) === 'enabled' &&
//   !message.fromMe &&
//   !chatDetails.isGroup
// ) {
//   try {
//     yield handleMessageTypebot(whatsapp, message, ticket);
//   } catch (error) {
//     logger.warn('::: Z-PRO ::: ZDG ::: HandleMessageTypebot', error);
//   }
// }
// if (
//   (dialogflowSetting?.value) === 'enabled' &&
//   !message.fromMe &&
//   !chatDetails.isGroup
// ) {
//   try {
//     yield handleMessageDialogflow(whatsapp, message, ticket);
//   } catch (error) {
//     logger.warn('::: Z-PRO ::: ZDG ::: HandleMessageDialogFlow', error);
//   }
// }

// if (
//   (n8nSetting?.value) === 'enabled' &&
//   !message.fromMe &&
//   !chatDetails.isGroup &&
//   ticket.n8nStatus
// ) {
//   try {
//     if (message.hasMedia) {
//       const media = yield message.downloadMedia();
//       yield sendN8NWebhook(message, media, ticket);
//     } else {
//       yield sendN8NWebhook(message, 'texto', ticket);
//     }
//   } catch (error) {
//     logger.warn('::: Z-PRO ::: ZDG ::: HandleMessageN8N', error);
//   }
// }

// if (message.type === 'location') {
//   yield verifyMediaMessage(message, ticket, contact);
// }

// if (message.type === 'sticker') {
//   yield verifyMediaMessage(message, ticket, contact);
// }

// if (message.type !== 'location' && message.type !== 'sticker') {
//   if (message.hasMedia) {
//     yield verifyMediaMessage(message, ticket, contact);
//   } else {
//     yield verifyMessage(message, ticket, contact);
//   }
// }

// if (
//   config.transcribeAudio === 'enabled' &&
//   config.transcribeAudioJson &&
//   !message.fromMe &&
//   (message.type === 'audio' || message.type === 'ptt')
// ) {
//   const messageFilter = {
//     messageId: message.id.id,
//     tenantId: ticket.tenantId,
//   };
//   const findOneOptions = { where: messageFilter };
//   const mediaMessage = yield Message.findOne(findOneOptions);

//   if (mediaMessage && mediaMessage.mediaUrl) {
//     const urlParts = mediaMessage.mediaUrl.split('/');
//     const fileName = urlParts[urlParts.length - 1];
//     const filePath = path.join(
//       __dirname,
//       '..',
//       '..',
//       '..',
//       '..',
//       'public',
//       fileName.replace('ogg', 'mp3')
//     );
//     const transcriptionConfig = JSON.stringify(config.transcribeAudioJson);

//     transcribeAudio(filePath, transcriptionConfig)
//       .then(async (transcription) => {
//         try {
//           const transcriptionMessage = {
//             body: transcription,
//             fromMe: true,
//             read: true,
//           };
//           const messageDetails = {
//             msg: transcriptionMessage,
//             tenantId: tenantId,
//             ticket: ticket,
//             userId: ticket.userId,
//             sendType: 'transcription',
//             status: 'sended',
//             ack: 2,
//           };
//           yield createMessageSystemService(messageDetails);
//         } catch (error) {
//           logger.info(
//             '::: Z-PRO ::: ZDG ::: try CreateMessageSystemServiceTranscription' + error
//           );
//         }
//       })
//       .catch((error) => {
//         logger.warn('Error during transcription:', error);
//       });
//   }
// }
// const withinBusinessHours = yield verifyBusinessHours(message, ticket);

// if (!message.fromMe) {
//   const tenantFilter = { tenantId: tenantId };
//   const findAllOptions = { where: tenantFilter };
//   const chatFlows = yield ChatFlow.findAll(findAllOptions);

//   if (chatFlows) {
//     for (const chatFlow of chatFlows) {
//       const configurationNode = chatFlow?.flow.nodeList.find(
//         (node) => node.type === 'configurations'
//       );

//       try {
//         const keywordConfig = configurationNode?.configurations?.keyword?.message;

//         if (keywordConfig && message.body === keywordConfig) {
//           const ticketDetails = {
//             id: ticket.id,
//             tenantId: tenantId,
//           };
//           const updatedTicket = yield showTicketService(ticketDetails);
//           const updateData = {
//             chatFlowId: chatFlow.id,
//             stepChatFlow: 'nodeC',
//             answered: false,
//             firstCall: true,
//             status: 'pending',
//             isCreated: true,
//           };
//           yield ticket.update(updateData);

//           const socketPayload = {
//             tenantId: tenantId,
//             type: 'ticket:update',
//             payload: updatedTicket,
//           };
//           socketEmit(socketPayload);

//           if (withinBusinessHours) {
//             verifyStepsChatFlowTicket(whatsapp, message, ticket);
//           }

//           const answerUpdate = { answered: true };
//           yield ticket.update(answerUpdate);
//         }
//       } catch (error) {}
//     }
//   }
// }
// if (withinBusinessHours) {
//   yield verifyStepsChatFlowTicket(whatsapp, message, ticket);
// }

// if (!ticket.queueId && config.queueId) {
//   const queueUpdate = { queueId: config.queueId };
//   yield ticket.update(queueUpdate);

//   const ticketDetails = {
//     id: ticket.id,
//     tenantId: tenantId,
//   };
//   const updatedTicket = yield showTicketService(ticketDetails);

//   const socketPayload = {
//     tenantId: tenantId,
//     type: 'ticket:update',
//     payload: updatedTicket,
//   };
//   socketEmit(socketPayload);
// }

// if (!ticket.userId && config.userId) {
//   const userUpdate = { userId: config.userId };
//   yield ticket.update(userUpdate);

//   const ticketDetails = {
//     id: ticket.id,
//     tenantId: tenantId,
//   };
//   const updatedTicket = yield showTicketService(ticketDetails);

//   const socketPayload = {
//     tenantId: tenantId,
//     type: 'ticket:update',
//     payload: updatedTicket,
//   };
//   socketEmit(socketPayload);
// }

// const apiConfig = ticket.apiConfig || {};

// if (
//   !message.fromMe &&
//   !ticket.isGroup &&
//   !ticket.answered &&
//   apiConfig?.externalKey &&
//   apiConfig?.urlMessageStatus
// ) {
//   const hookMessage = {
//     timestamp: Date.now(),
//     msg: message,
//     messageId: message.id.id,
//     ticketId: ticket.id,
//     externalKey: apiConfig?.externalKey,
//     authToken: apiConfig?.authToken,
//     type: 'hookMessage',
//   };
//   const queuePayload = {
//     url: apiConfig.urlMessageStatus,
//     type: hookMessage.type,
//     payload: hookMessage,
//   };
//   Queue.add('WebHooksAPI', queuePayload);
// }

// delay(2000, null).then(async () => {
//   await chatDetails.clearState();
// });

// completeProcessing();


// } catch (error) {

// }