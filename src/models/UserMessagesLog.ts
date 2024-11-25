import {
	AllowNull,
	AutoIncrement,
	BelongsTo,
	Column,
	CreatedAt,
	DataType,
	Default,
	ForeignKey,
	Model,
	PrimaryKey,
	Table,
	UpdatedAt,
} from "sequelize-typescript";
import Message from "./Message";
import Ticket from "./Ticket";
import User from "./User";

@Table({ freezeTableName: true })
class UserMessagesLog extends Model<UserMessagesLog> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number;

	@ForeignKey(() => User)
	@Column(DataType.INTEGER)
	declare userId: number;

	@BelongsTo(() => User)
	declare user: User;

	@ForeignKey(() => Message)
	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	declare messageId: string;

	@BelongsTo(() => Message, "messageId")
	declare message: Message;

	@ForeignKey(() => Ticket)
	@Default(null)
	@AllowNull
	@Column(DataType.INTEGER)
	declare ticketId: number;

	@BelongsTo(() => Ticket)
	declare ticket: Ticket;

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date;
	tableName: '"UserMessagesLog";';
}

export default UserMessagesLog;
