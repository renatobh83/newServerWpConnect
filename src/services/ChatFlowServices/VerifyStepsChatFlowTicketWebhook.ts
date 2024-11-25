/* eslint-disable no-return-assign */
// import type { Message as WbotMessage } from "whatsapp-web.js";
import socketEmit from "../../helpers/socketEmit";
import type Ticket from "../../models/Ticket";
import CreateMessageSystemService from "../MessageServices/CreateMessageSystemService";
import CreateLogTicketService from "../TicketServices/CreateLogTicketService";
import BuildSendMessageService, {
  MessageType,
} from "./BuildSendMessageService";
// import DefinedUserBotService from "./DefinedUserBotService";
import IsContactTest from "./IsContactTest";
import { validarCPF } from "../../utils/ApiWebhook";

const validateStep = async (ticket: Ticket, step: any): Promise<boolean> => {
  if (step.data.label === "pesquisaCPF") {
    return validarCPF(ticket.lastMessage.toString().trim());
  }
  return true;
};
export const isNextSteps = async (
  ticket: Ticket,
  chatFlow: any,
  step: any,
  stepCondition: any
): Promise<void> => {
  // action = 0: enviar para proximo step: nextStepId
  if (stepCondition.action === 0) {
    const previousStepId = ticket.stepChatFlow; // Guardar o passo anterior
    const validationPassed = await validateStep(ticket, step);
    if (!validationPassed) {
      await ticket.update({
        stepChatFlow: previousStepId, // Restaurar para o passo anterior
        botRetries: ticket.botRetries + 1, // Incrementar tentativas do bot
        lastInteractionBot: new Date(),
      });

      // Enviar mensagem de erro para o usuário
      await CreateMessageSystemService({
        msg: {
          body: "CPF inválido. Por favor, revise as informações e tente novamente.",
          fromMe: true,
          read: true,
          sendType: "bot",
        },
        tenantId: ticket.tenantId,
        ticket,
        sendType: "bot",
        status: "pending",
      });

      return; // Sair sem avançar para o próximo passo
    }
    console.log(stepCondition.nextStepId);
    await ticket.update({
      stepChatFlow: stepCondition.nextStepId,
      botRetries: 0,
      lastInteractionBot: new Date(),
    });

    const nodesList = [...chatFlow.flow.nodeList];

    /// pegar os dados do proximo step
    const nextStep = nodesList.find(
      (n: any) => n.id === stepCondition.nextStepId
    );

    if (!nextStep) return;

    for (const interaction of nextStep.data.interactions) {
      await BuildSendMessageService({
        msg: interaction,
        tenantId: ticket.tenantId,
        ticket,
      });
    }
    // await SetTicketMessagesAsRead(ticket);
  }
};

// const isQueueDefine = async (
//   ticket: Ticket,
//   flowConfig: any,
//   step: any,
//   stepCondition: any
// ): Promise<void> => {
//   // action = 1: enviar para fila: queue
//   if (stepCondition.action === 1) {
//     ticket.update({
//       queueId: stepCondition.queueId,
//       chatFlowId: null,
//       stepChatFlow: null,
//       botRetries: 0,
//       lastInteractionBot: new Date(),
//     });

//     await CreateLogTicketService({
//       ticketId: ticket.id,
//       type: "queue",
//       queueId: stepCondition.queueId,
//     });

//     if (flowConfig?.data?.autoDistributeTickets) {
//       await DefinedUserBotService(
//         ticket,
//         stepCondition.queueId,
//         ticket.tenantId,
//         flowConfig?.data?.autoDistributeTickets
//       );
//       ticket.reload();
//     }

//     socketEmit({
//       tenantId: ticket.tenantId,
//       type: "ticket:update",
//       payload: ticket,
//     });
//   }
// };

// const isUserDefine = async (
//   ticket: Ticket,
//   step: any,
//   stepCondition: any
// ): Promise<void> => {
//   // action = 2: enviar para determinado usuário
//   if (stepCondition.action === 2) {
//     ticket.update({
//       userId: stepCondition.userIdDestination,
//       // status: "pending",
//       chatFlowId: null,
//       stepChatFlow: null,
//       botRetries: 0,
//       lastInteractionBot: new Date(),
//     });

//     ticket.reload();

//     socketEmit({
//       tenantId: ticket.tenantId,
//       type: "ticket:update",
//       payload: ticket,
//     });

//     await CreateLogTicketService({
//       userId: stepCondition.userIdDestination,
//       ticketId: ticket.id,
//       type: "userDefine",
//     });
//   }
// };

// const isCloseDefine = async (ticket, actionDetails) => {
//   if (actionDetails.action === 3) {
//     const closeTicketMessage = { message: actionDetails.closeTicket };

//     const messageField = {
//       data: closeTicketMessage,
//       id: actionDetails.id,
//       type: MessageType.MediaField,
//     };
//     const messageArray = [messageField];
//     const firstMessage = messageArray[0];

//     const sendMessageParams = {
//       msg: messageField,
//       tenantId: ticket.tenantId,
//       ticket: ticket,
//     };
//     await BuildSendMessageService(sendMessageParams);

//     ticket.update({
//       status: "closed",
//       chatFlowId: null,
//       stepChatFlow: null,
//       botRetries: 0,
//       lastInteractionBot: new Date(),
//     });
//     const showTicketParams = {
//       id: ticket.id,
//       tenantId: ticket.tenantId,
//     };

//     // const updatedTicket = yield ShowTicketServiceZPRO_1.default(
//     //     showTicketParams
//     //   ),
//     //   socketParams = {
//     //     tenantId: ticket.tenantId,
//     //     type: "ticket:update",
//     //     payload: updatedTicket,
//     //   };
//     // socketEmitZPRO_1.default(socketParams);
//   }
// };

// enviar mensagem de boas vindas à fila ou usuário
const sendWelcomeMessage = async (
  ticket: Ticket,
  flowConfig: any
): Promise<void> => {
  if (flowConfig?.data?.welcomeMessage?.message) {
    const messageData = {
      body: flowConfig.data?.welcomeMessage.message,
      fromMe: true,
      read: true,
      sendType: "bot",
    };

    await CreateMessageSystemService({
      msg: messageData,
      tenantId: ticket.tenantId,
      ticket,
      sendType: messageData.sendType,
      status: "pending",
    });
  }
};

const isRetriesLimit = async (
  ticket: Ticket,
  flowConfig: any
): Promise<boolean> => {
  // verificar o limite de retentativas e realizar ação
  const maxRetryNumber = flowConfig?.data?.maxRetryBotMessage?.number;
  if (
    flowConfig?.data?.maxRetryBotMessage &&
    maxRetryNumber &&
    ticket.botRetries >= maxRetryNumber - 1
  ) {
    const destinyType = flowConfig.data.maxRetryBotMessage.type;
    const { destiny } = flowConfig.data.maxRetryBotMessage;
    const updatedValues: any = {
      chatFlowId: null,
      stepChatFlow: null,
      botRetries: 0,
      lastInteractionBot: new Date(),
    };
    const logsRetry: any = {
      ticketId: ticket.id,
      type: destinyType === 1 ? "retriesLimitQueue" : "retriesLimitUserDefine",
    };

    // enviar para fila
    if (destinyType === 1 && destiny) {
      updatedValues.queueId = destiny;
      logsRetry.queueId = destiny;
    }
    // enviar para usuario
    if (destinyType === 2 && destiny) {
      updatedValues.userId = destiny;
      logsRetry.userId = destiny;
    }

    ticket.update(updatedValues);
    socketEmit({
      tenantId: ticket.tenantId,
      type: "ticket:update",
      payload: ticket,
    });
    await CreateLogTicketService(logsRetry);

    // enviar mensagem de boas vindas à fila ou usuário
    await sendWelcomeMessage(ticket, flowConfig);
    return true;
  }
  return false;
};

// const isAnswerCloseTicket = async (
//   flowConfig: any,
//   ticket: Ticket,
//   message: string
// ): Promise<boolean> => {
//   if (
//     !flowConfig?.data?.answerCloseTicket ||
//     flowConfig?.data?.answerCloseTicket?.length < 1
//   ) {
//     return false;
//   }

//   // verificar condição com a ação
//   const params = flowConfig.data.answerCloseTicket.find((condition: any) => {
//     return (
//       String(condition).toLowerCase().trim() ===
//       String(message).toLowerCase().trim()
//     );
//   });

//   if (params) {
//     await ticket.update({
//       chatFlowId: null,
//       stepChatFlow: null,
//       botRetries: 0,
//       lastInteractionBot: new Date(),
//       unreadMessages: 0,
//       answered: false,
//       status: "closed",
//     });

//     await CreateLogTicketService({
//       ticketId: ticket.id,
//       type: "autoClose",
//     });

//     socketEmit({
//       tenantId: ticket.tenantId,
//       type: "ticket:update",
//       payload: ticket,
//     });

//     return true;
//   }
//   return false;
// };

const VerifyStepsChatFlowTicketWebhook = async (
  ticket: Ticket | any,
  type: string
): Promise<void> => {
  let celularTeste: string; // ticket.chatFlow?.celularTeste;

  if (
    ticket.chatFlowId &&
    ticket.status === "pending" &&
    !ticket.isGroup &&
    !ticket.answered
  ) {
    if (ticket.chatFlowId) {
      const chatFlow = await ticket.getChatFlow();

      if (chatFlow.celularTeste) {
        celularTeste = chatFlow.celularTeste.replace(/\s/g, ""); // retirar espaços
      }

      const step = chatFlow.flow.nodeList.find(
        (node: any) => node.id === ticket.stepChatFlow
      );

      const flowConfig = chatFlow.flow.nodeList.find(
        (node: any) => node.type === "configurations"
      );

      // verificar condição com a ação do step
      const stepCondition = step.data.conditions.filter((conditions: any) => {
        if (conditions.type === type) return true;
      });

      if (stepCondition) {
        // await CreateAutoReplyLogsService(stepAutoReplyAtual, ticket, msg.body);
        // Verificar se rotina em teste
        if (
          await IsContactTest(
            ticket.contact.number,
            celularTeste,
            ticket.channel
          )
        )
          return;

        // action = 0: enviar para proximo step: nextStepId
        await isNextSteps(ticket, chatFlow, step, stepCondition[0]);

        // // action = 1: enviar para fila: queue
        // await isQueueDefine(ticket, flowConfig, step, stepCondition);

        // // action = 2: enviar para determinado usuário
        // await isUserDefine(ticket, step, stepCondition);

        // // action = 3: encerar atendimento
        // await isCloseDefine(ticket, stepCondition);

        socketEmit({
          tenantId: ticket.tenantId,
          type: "ticket:update",
          payload: ticket,
        });

        // if (stepCondition.action === 1 || stepCondition.action === 2) {
        //   await sendWelcomeMessage(ticket, flowConfig);
        // }
      } else {
        // Verificar se rotina em teste
        if (
          await IsContactTest(
            ticket.contact.number,
            celularTeste,
            ticket.channel
          )
        )
          return;

        // se ticket tiver sido criado, ingnorar na primeria passagem
        if (!ticket.isCreated) {
          if (await isRetriesLimit(ticket, flowConfig)) return;

          const messageData = {
            body:
              flowConfig.data.notOptionsSelectMessage.message ||
              "Desculpe! Não entendi sua resposta. Vamos tentar novamente! Escolha uma opção válida.",
            fromMe: true,
            read: true,
            sendType: "bot",
          };
          await CreateMessageSystemService({
            msg: messageData,
            tenantId: ticket.tenantId,
            ticket,
            sendType: messageData.sendType,
            status: "pending",
          });

          // tratar o número de retentativas do bot
          await ticket.update({
            botRetries: ticket.botRetries + 1,
            lastInteractionBot: new Date(),
          });
        }
        for (const interaction of step.data.interactions) {
          await BuildSendMessageService({
            msg: interaction,
            tenantId: ticket.tenantId,
            ticket,
          });
        }
      }
      // await SetTicketMessagesAsRead(ticket);
      // await SetTicketMessagesAsRead(ticket);
    }
  }
};

export default VerifyStepsChatFlowTicketWebhook;
