import { DatabaseError } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import * as QueueJobs from "../libs/Queue";
import ApiConfig from "../models/ApiConfig";
import ApiConfirmacao from "../models/ApiConfirmacao";
import ApiMessage from "../models/ApiMessage";
import AutoReply from "../models/AutoReply";
import AutoReplyLogs from "../models/AutoReplyLogs";
import Campaign from "../models/Campaign";
import CampaignContacts from "../models/CampaignContacts";
import ChatFlow from "../models/ChatFlow";
import Confirmacao from "../models/Confirmacao";
import Contact from "../models/Contact";
import ContactCustomField from "../models/ContactCustomField";
import ContactTag from "../models/ContactTag";
import ContactWallet from "../models/ContactWallet";
import FastReply from "../models/FastReply";
import LogTicket from "../models/LogTicket";
import Message from "../models/Message";
import MessageOffLine from "../models/MessageOffLine";
import Queue from "../models/Queue";
import Setting from "../models/Setting";
import StepsReply from "../models/StepsReply";
import StepsReplyAction from "../models/StepsReplyAction";
import Tag from "../models/Tag";
import Tenant from "../models/Tenant";
import Ticket from "../models/Ticket";
import User from "../models/User";
import UserMessagesLog from "../models/UserMessagesLog";
import UsersQueues from "../models/UsersQueues";
import Whatsapp from "../models/Whatsapp";
import { logger } from "../utils/logger";

interface CustomSequelize extends Sequelize {
	afterConnect?: any;
	afterDisconnect?: any;
}

// eslint-disable-next-line
const dbConfig = require("../config/database");
const sequelize: CustomSequelize = new Sequelize(dbConfig);

const models = [
	User,
	Contact,
	Ticket,
	Message,
	MessageOffLine,
	Whatsapp,
	ContactCustomField,
	Setting,
	AutoReply,
	StepsReply,
	StepsReplyAction,
	Queue,
	UsersQueues,
	Tenant,
	AutoReplyLogs,
	UserMessagesLog,
	FastReply,
	Tag,
	ContactWallet,
	ContactTag,
	Confirmacao,
	Campaign,
	CampaignContacts,
	ApiConfig,
	ApiMessage,
	LogTicket,
	ChatFlow,
	ApiConfirmacao,
];

sequelize.addModels(models);

async function handleSequelizeError(error: any) {
	if (
		error instanceof DatabaseError &&
		error.message.includes("Connection terminated unexpectedly")
	) {
		logger.error(
			"DATABASE CONNECTION TERMINATED, retrying in 5 seconds:",
			error,
		);

		setTimeout(() => {
			logger.info("Retrying database connection...");
			connectWithRetry();
		}, 5000);
	} else {
		logger.error("Sequelize encountered an error:", error);
		throw error; // Lançar o erro para tratamento posterior
	}
}
// Função para tentar reconectar automaticamente
// Função de conexão com retry apenas quando necessário
async function connectWithRetry() {
	try {
		await sequelize.authenticate();
		logger.info("DATABASE CONNECTED");
		QueueJobs.default.add("VerifyTicketsChatBotInactives", {});
		QueueJobs.default.add("SendMessageSchenduled", {});
	} catch (error) {
		handleSequelizeError(error); // Chama o handler para reconexão condicional
	}
}

sequelize.afterConnect(() => {
	logger.info("DATABASE CONNECT");
	QueueJobs.default.add("VerifyTicketsChatBotInactives", {});
	QueueJobs.default.add("SendMessageSchenduled", {});
});

sequelize.afterDisconnect(() => {
	logger.info("DATABASE DISCONNECT");
});

// Inicializar a primeira tentativa de conexão
connectWithRetry();

export default sequelize;
