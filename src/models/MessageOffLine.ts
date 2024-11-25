import {
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
import Contact from "./Contact";
import Message from "./Message";
import Ticket from "./Ticket";
import User from "./User";

@Table({ freezeTableName: true })
class MessagesOffLine extends Model<MessagesOffLine> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER) // Usando INTEGER para id autoincremento
	declare id: number;

	@Default(0)
	@Column(DataType.INTEGER) // Usando INTEGER para ack (confirmação)
	declare ack: number;

	@Default(false)
	@Column(DataType.BOOLEAN) // Usando BOOLEAN para saber se foi lida
	declare read: boolean;

	@Default(false)
	@Column(DataType.BOOLEAN) // Usando BOOLEAN para saber se foi enviada por nossa parte
	declare fromMe: boolean;

	@Column(DataType.TEXT) // Usando TEXT para armazenar o corpo da mensagem
	declare body: string;

	@Column(DataType.VIRTUAL) // Propriedade virtual para obter o nome da mídia
	get mediaName(): string | null {
		return this.getDataValue("mediaUrl");
	}

	@Column(DataType.STRING) // Usando STRING para armazenar a URL da mídia
	get mediaUrl(): string | null {
		if (this.getDataValue("mediaUrl")) {
			const { BACKEND_URL } = process.env;
			const value = this.getDataValue("mediaUrl");
			return `${BACKEND_URL}/public/${value}`;
		}
		return null;
	}

	@Column(DataType.STRING) // Usando STRING para armazenar o tipo da mídia
	declare mediaType: string;

	@Default(false)
	@Column(DataType.BOOLEAN) // Usando BOOLEAN para saber se a mensagem foi deletada
	declare isDeleted: boolean;

	@CreatedAt
	@Column(DataType.DATE(6)) // Usando DATE(6) para capturar a data de criação com precisão
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6)) // Usando DATE(6) para capturar a data de atualização com precisão
	declare updatedAt: Date;

	@ForeignKey(() => Message)
	@Column(DataType.UUID) // Usando UUID para referenciar a mensagem citada
	declare quotedMsgId: string;

	@BelongsTo(() => Message, "quotedMsgId")
	declare quotedMsg: Message;

	@ForeignKey(() => Ticket)
	@Column(DataType.INTEGER) // Usando INTEGER para referenciar o Ticket
	declare ticketId: number;

	@BelongsTo(() => Ticket)
	declare ticket: Ticket;

	@ForeignKey(() => Contact)
	@Column(DataType.INTEGER) // Usando INTEGER para referenciar o Contact
	declare contactId: number;

	@BelongsTo(() => Contact, "contactId")
	declare contact: Contact;

	@ForeignKey(() => User)
	@Column(DataType.INTEGER) // Usando INTEGER para referenciar o User
	declare userId: number;

	@BelongsTo(() => User)
	declare user: User;

	// Nome da tabela será "MessagesOffLine" como configurado
	tableName: "MessagesOffLine";
}

export default MessagesOffLine;
