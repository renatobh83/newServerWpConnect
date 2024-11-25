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
import Queue from "./Queue";
import Ticket from "./Ticket";
import User from "./User";

@Table
class LogTicket extends Model<LogTicket> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER) // Definido como inteiro, já que é auto-incremento
	declare id: number;

	@Column(DataType.TEXT) // Definido como TEXT para armazenar o tipo do log, pode ser longo
	declare type: string;

	@CreatedAt
	@Column(DataType.DATE(6)) // Definido como DATE(6) para precisão de milissegundos
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6)) // Definido como DATE(6) para precisão de milissegundos
	declare updatedAt: Date;

	@ForeignKey(() => Ticket)
	@Column(DataType.INTEGER) // Chave estrangeira para Ticket, geralmente é inteiro
	declare ticketId: number;

	@BelongsTo(() => Ticket)
	declare ticket: Ticket;

	@ForeignKey(() => User)
	@Default(null)
	@AllowNull
	@Column(DataType.INTEGER) // Chave estrangeira para User, também geralmente inteiro
	declare userId: number;

	@BelongsTo(() => User)
	declare user: User;

	@ForeignKey(() => Queue)
	@Column(DataType.INTEGER) // Chave estrangeira para Queue, também geralmente inteiro
	declare queueId: number;

	@BelongsTo(() => Queue)
	declare queue: Queue;
}

export default LogTicket;
