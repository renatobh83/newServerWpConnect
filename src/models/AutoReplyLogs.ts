import {
	AutoIncrement,
	BelongsTo,
	Column,
	CreatedAt,
	DataType,
	ForeignKey,
	Model,
	PrimaryKey,
	Table,
	UpdatedAt,
} from "sequelize-typescript";
import Contact from "./Contact";
import Ticket from "./Ticket";

@Table({ freezeTableName: true })
class AutoReplyLogs extends Model<AutoReplyLogs> {
	@PrimaryKey
	@AutoIncrement
	@Column
	declare id: string;

	@Column
	autoReplyId: number;

	@Column(DataType.TEXT)
	autoReplyName: string;

	@Column
	stepsReplyId: string;

	@Column(DataType.TEXT)
	stepsReplyMessage: string;

	@Column(DataType.TEXT)
	wordsReply: string;

	@ForeignKey(() => Ticket)
	@Column
	ticketId: number;

	@BelongsTo(() => Ticket)
	ticket: Ticket;

	@ForeignKey(() => Contact)
	@Column
	contactId: number;

	@BelongsTo(() => Contact, "contactId")
	contact: Contact;

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date;

	tableName: "AutoReplyLogs";
}

export default AutoReplyLogs;
