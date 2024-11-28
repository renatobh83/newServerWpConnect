import { DatabaseError } from "sequelize";
import { Sequelize } from "sequelize-typescript";
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
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	afterConnect?: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	afterDisconnect?: any;
}

const dbConfig = require("../config/database");

const models = [
	Whatsapp,
	User,
	Contact,
	Ticket,
	Message,
	MessageOffLine,
	ContactCustomField,
	Setting,
	AutoReply,
	StepsReply,
	StepsReplyAction,
	Queue,
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
	UsersQueues,
];

const sequelize: CustomSequelize = new Sequelize(dbConfig);
sequelize.addModels(models);
// Função para tentar reconectar automaticamente
async function connectWithRetry() {
	try {
		// const sync = await sequelize.sync();
		// console.log(sync);
		await sequelize.authenticate();
		logger.info("DATABASE CONNECTED");

		// Adicionar tarefas à fila após a conexão bem-sucedida
		// QueueJobs.default.add("VerifyTicketsChatBotInactives", {});
		// QueueJobs.default.add("SendMessageSchenduled", {});
	} catch (error) {
		handleSequelizeError(error); // Chama o handler para reconexão condicional
	}
}

// Função para tratar erros de conexão
async function handleSequelizeError(error: any) {
	if (
		error instanceof DatabaseError &&
		error.message.includes("Connection terminated unexpectedly")
	) {
		logger.error(
			"DATABASE CONNECTION TERMINATED, retrying in 5 seconds:",
			error,
		);

		// Tentar reconectar após 5 segundos
		setTimeout(() => {
			logger.info("Retrying database connection...");
			connectWithRetry();
		}, 5000);
	} else {
		logger.error("Sequelize encountered an error:", error);
		throw error; // Lançar o erro para tratamento posterior
	}
}

// Inicializar a primeira tentativa de conexão
connectWithRetry().catch((error) => {
	logger.error("Initial connection attempt failed.", error);
	process.exit(1); // Encerra o servidor se a conexão inicial falhar
});

// Exemplo de log para monitorar o estado da conexão
sequelize.afterConnect(() => {
	logger.info("DATABASE CONNECT");
	// QueueJobs.default.add("VerifyTicketsChatBotInactives", {});
	// QueueJobs.default.add("SendMessageSchenduled", {});
});

sequelize.afterDisconnect(() => {
	logger.info("DATABASE DISCONNECT");
});

export default sequelize;
