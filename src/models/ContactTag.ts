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
import Tag from "./Tag";
import Tenant from "./Tenant";

@Table
class ContactTag extends Model<ContactTag> {
	// Definindo a chave primária com auto incremento
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number;

	// Chave estrangeira para associar ao modelo Contact
	@ForeignKey(() => Contact)
	@Column(DataType.INTEGER)
	declare contactId: number;

	// Relacionamento "Pertence a" com o modelo Contact
	@BelongsTo(() => Contact)
	declare contact: Contact;

	// Chave estrangeira para associar ao modelo Tag
	@ForeignKey(() => Tag)
	@Column(DataType.INTEGER)
	declare tagId: number;

	// Relacionamento "Pertence a" com o modelo Tag
	@BelongsTo(() => Tag)
	declare tag: Tag;

	// Chave estrangeira para associar ao modelo Tenant
	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER)
	declare tenantId: number;

	// Relacionamento "Pertence a" com o modelo Tenant
	@BelongsTo(() => Tenant)
	declare tenant: Tenant;

	// Data de criação do registro
	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date;

	// Data de atualização do registro
	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date;
}

export default ContactTag;
