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
	@Column(DataType.INTEGER) // Definido como INTEGER, já que é um identificador numérico
	declare declare id: number;

	@Column(DataType.INTEGER) // Definido como INTEGER, pois é um identificador numérico
	declare autoReplyId: number;

	@Column(DataType.STRING) // Usado STRING para textos curtos, como o nome do autoReply
	declare autoReplyName: string;

	@Column(DataType.STRING) // Usado STRING para identificar o stepsReply
	declare stepsReplyId: string;

	@Column(DataType.STRING) // Usado STRING para armazenar a mensagem de resposta
	declare stepsReplyMessage: string;

	@Column(DataType.STRING) // Usado STRING para armazenar as palavras de resposta
	declare wordsReply: string;

	@ForeignKey(() => Ticket)
	@Column(DataType.INTEGER) // Relacionamento com Ticket, identificado por um número
	declare ticketId: number;

	@BelongsTo(() => Ticket)
	declare ticket: Ticket;

	@ForeignKey(() => Contact)
	@Column(DataType.INTEGER) // Relacionamento com Contact, identificado por um número
	declare contactId: number;

	@BelongsTo(() => Contact, "contactId")
	declare contact: Contact;

	@CreatedAt
	@Column(DataType.DATE(6)) // Utilizando DATE com precisão de até 6 dígitos
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6)) // Utilizando DATE com precisão de até 6 dígitos
	declare updatedAt: Date;

	tableName: "AutoReplyLogs";
}

export default AutoReplyLogs;
