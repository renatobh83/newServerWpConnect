// import AppError from "../../errors/AppError";
import AutoReplyLogs from "../../models/AutoReplyLogs";
import type StepsReply from "../../models/StepsReply";
import type Ticket from "../../models/Ticket";

const CreateAutoReplyLogService = async (
	stepsReply: StepsReply,
	ticket: Ticket,
	msg: string,
): Promise<AutoReplyLogs> => {
	const log: AutoReplyLogs = {
		autoReplyId: stepsReply.idAutoReply,
		autoReplyName: stepsReply.autoReply.name,
		stepsReplyId: String(stepsReply.id),
		stepsReplyMessage: stepsReply.reply,
		wordsReply: msg,
		ticketId: ticket.id,
		contactId: ticket.contactId,
	} as unknown as AutoReplyLogs;
	const autoReplyLog = await AutoReplyLogs.create(log);

	return autoReplyLog;
};

export default CreateAutoReplyLogService;
