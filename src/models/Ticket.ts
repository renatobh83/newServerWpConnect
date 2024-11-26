import {
	AllowNull,
	AutoIncrement,
	BelongsTo,
	Column,
	CreatedAt,
	// AfterCreate,
	DataType,
	Default,
	ForeignKey,
	HasMany,
	Model,
	PrimaryKey,
	Table,
	UpdatedAt,
} from "sequelize-typescript";

import { format } from "date-fns";
import AutoReply from "./AutoReply";
import ChatFlow from "./ChatFlow";
import Contact from "./Contact";
import Message from "./Message";
import MessagesOffLine from "./MessageOffLine";
import Queue from "./Queue";
import StepsReply from "./StepsReply";
// import ShowStepAutoReplyMessageService from "../services/AutoReplyServices/ShowStepAutoReplyMessageService";
import Tenant from "./Tenant";
import User from "./User";
import Whatsapp from "./Whatsapp";

@Table
class Ticket extends Model<Ticket> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number;

	@Column({ defaultValue: "pending", type: DataType.STRING })
	declare status: string;

	@Column(DataType.INTEGER)
	declare unreadMessages: number;

	@Column(DataType.STRING)
	declare lastMessage: string;

	@Column(DataType.STRING)
	declare channel: string;

	@Default(true)
	@Column(DataType.BOOLEAN)
	declare answered: boolean;

	@Default(false)
	@Column(DataType.BOOLEAN)
	declare isGroup: boolean;

	@Default(false)
	@Column(DataType.BOOLEAN)
	declare isActiveDemand: boolean;

	@Default(false)
	@Column(DataType.BOOLEAN)
	declare isFarewellMessage: boolean;

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date;

	@Column(DataType.DATE)
	declare lastInteractionBot: Date;

	@Column(DataType.INTEGER)
	declare botRetries: number;

	@Column(DataType.BIGINT)
	declare closedAt: number;

	@Column(DataType.BIGINT)
	declare lastMessageAt: number;

	@Column(DataType.BIGINT)
	declare startedAttendanceAt: number;

	@ForeignKey(() => User)
	@Column(DataType.INTEGER)
	declare userId: number;

	@BelongsTo(() => User)
	declare user: User;

	@ForeignKey(() => Contact)
	@Column(DataType.INTEGER)
	declare contactId: number;

	@BelongsTo(() => Contact)
	declare contact: Contact;

	@ForeignKey(() => Whatsapp)
	@Column(DataType.INTEGER)
	declare whatsappId: number;

	@BelongsTo(() => Whatsapp)
	declare whatsapp: Whatsapp;

	@HasMany(() => Message)
	declare messages: Message[];

	@ForeignKey(() => AutoReply)
	@Column(DataType.STRING)
	declare autoReplyId: string;

	@BelongsTo(() => AutoReply)
	declare autoReply: AutoReply;

	@ForeignKey(() => StepsReply)
	@Column(DataType.STRING)
	declare stepAutoReplyId: string;

	@BelongsTo(() => StepsReply)
	declare stepsReply: StepsReply;

	@ForeignKey(() => ChatFlow)
	@Column(DataType.INTEGER)
	declare chatFlowId: number;

	@BelongsTo(() => ChatFlow)
	declare chatFlow: ChatFlow;

	@Default(null)
	@AllowNull
	@Column(DataType.INTEGER)
	declare stepChatFlow: number | null;

	@ForeignKey(() => Queue)
	@Default(null)
	@AllowNull
	@Column(DataType.INTEGER)
	declare queueId: number | null;

	@BelongsTo(() => Queue)
	declare queue: Queue;

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER)
	declare tenantId: number;

	@Default(null)
	@Column(DataType.VIRTUAL)
	declare isTransference: string | boolean | null;

	@Default(null)
	@Column(DataType.VIRTUAL)
	declare isCreated: boolean | null;

	@Default([])
	@Column(DataType.VIRTUAL)
	declare scheduledMessages: Message[];

	@BelongsTo(() => Tenant)
	declare tenant: Tenant;

	@HasMany(() => MessagesOffLine)
	declare messagesOffLine: MessagesOffLine[];

	@Default(null)
	@AllowNull
	@Column(DataType.JSONB)
	declare apiConfig: object | null;

	@Column(DataType.VIRTUAL)
	get protocol(): string {
		const date = this.getDataValue("createdAt");
		const formatDate = format(new Date(date), "yyyyddMMHHmmss");
		const id = this.getDataValue("id");
		return `${formatDate}${id}`;
	}
}

export default Ticket;
