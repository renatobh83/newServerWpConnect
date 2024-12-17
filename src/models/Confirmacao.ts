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
import Tenant from "./Tenant";
import Whatsapp from "./Whatsapp";

@Table({ tableName: "Confirmacao" })
class Confirmacao extends Model<Confirmacao> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number;

	@Column({ defaultValue: "pending", type: DataType.STRING })
	declare status: string;

	@Column(DataType.STRING)
	declare contatoSend: string;

	@Column(DataType.STRING)
	declare lastMessage: string;

	@Column(DataType.JSONB)
	declare procedimentos: number[];

	@Column(DataType.JSONB)
	declare idexterno: number[];

	@Column(DataType.STRING)
	declare atendimentoData: string;

	@Column(DataType.STRING)
	declare atendimentoHora: string;

	@Default(false)
	@Column(DataType.BOOLEAN)
	declare answered: boolean;

	@Column(DataType.BIGINT)
	declare lastMessageAt: number;

	@Column(DataType.STRING)
	declare messageResponse: string;

	@Default(false)
	@Column(DataType.BOOLEAN)
	declare preparoEnviado: boolean;


	@Column(DataType.BLOB)
	declare preparo: Buffer;

	@Column(DataType.BIGINT)
	declare closedAt: number;

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER)
	declare tenantId: number;

	@ForeignKey(() => Whatsapp)
	@Column(DataType.INTEGER)
	declare whatsappId: number;

	@BelongsTo(() => Whatsapp)
	declare whatsapp: Whatsapp;

	@Column(DataType.STRING)
	declare channel: string;

	@Column(DataType.DATE)
	declare enviada: Date;

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date;
}

export default Confirmacao;
