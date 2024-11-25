import {
	AllowNull,
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
import { v4 as uuidV4 } from "uuid";
import Contact from "./Contact";
import Tenant from "./Tenant";
import Ticket from "./Ticket";
import User from "./User";

@Table
class Message extends Model<Message> {
	@PrimaryKey
	@Default(uuidV4)
	@Column(DataType.UUID) // UUID para gerar automaticamente um identificador único
	declare id: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING) // Usando STRING para armazenar o messageId
	declare messageId: string;

	@Default(0)
	@Column(DataType.INTEGER) // Usando INTEGER para a confirmação (ack)
	declare ack: number;

	@Default(null)
	@AllowNull
	@Column(DataType.ENUM("pending", "sended", "received")) // Tipo ENUM para status da mensagem
	declare status: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING) // Usando STRING para armazenar WABA Media ID
	declare wabaMediaId: string;

	@Default(false)
	@Column(DataType.BOOLEAN) // Usando BOOLEAN para verificar se a mensagem foi lida
	declare read: boolean;

	@Default(false)
	@Column(DataType.BOOLEAN) // Usando BOOLEAN para verificar se a mensagem é enviada de nossa parte
	declare fromMe: boolean;

	@Column(DataType.TEXT) // Usando TEXT para armazenar o conteúdo da mensagem
	declare body: string;

	@Column(DataType.VIRTUAL) // Propriedade virtual para obter mediaName
	get mediaName(): string | null {
		return this.getDataValue("mediaUrl");
	}

	@Column(DataType.STRING) // Usando STRING para armazenar a URL do mídia
	get mediaUrl(): string | null {
		if (this.getDataValue("mediaUrl")) {
			const { BACKEND_URL } = process.env;
			const value = this.getDataValue("mediaUrl");
			return `${BACKEND_URL}/public/${value}`;
		}
		return null;
	}

	@Column(DataType.STRING) // Usando STRING para o tipo de mídia (image, video, etc)
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
	@Column(DataType.UUID) // Usando UUID para referenciar o id da mensagem citada
	declare quotedMsgId: string;

	@BelongsTo(() => Message, "quotedMsgId")
	declare quotedMsg: Message;

	@ForeignKey(() => Ticket)
	@Column(DataType.INTEGER) // Usando INTEGER para referenciar o id do Ticket
	declare ticketId: number;

	@BelongsTo(() => Ticket)
	declare ticket: Ticket;

	@ForeignKey(() => Contact)
	@Column(DataType.INTEGER) // Usando INTEGER para referenciar o id do Contact
	declare contactId: number;

	@BelongsTo(() => Contact, "contactId")
	declare contact: Contact;

	@Default(null)
	@AllowNull
	@Column(DataType.BIGINT) // Usando BIGINT para armazenar timestamp
	declare timestamp: number;

	@ForeignKey(() => User)
	@Default(null)
	@AllowNull
	@Column(DataType.INTEGER) // Usando INTEGER para referenciar o id do User
	declare userId: number;

	@BelongsTo(() => User)
	declare user: User;

	@Default(null)
	@AllowNull
	@Column(DataType.DATE) // Usando DATE para agendar a data de envio
	declare scheduleDate: Date;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING) // Usando STRING para armazenar a reação
	declare reaction: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING) // Usando STRING para armazenar a reação do usuário
	declare reactionFromMe: string;

	@Default(null)
	@AllowNull
	@Column(DataType.ENUM("campaign", "chat", "external", "schedule", "bot", "sync")) // Usando ENUM para tipo de envio
	declare sendType: string;

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER) // Usando INTEGER para referenciar o id do Tenant
	declare tenantId: number;

	@BelongsTo(() => Tenant)
	declare tenant: Tenant;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING) // Usando STRING para armazenar o id da frente (idFront)
	declare idFront: string;
}

export default Message;
