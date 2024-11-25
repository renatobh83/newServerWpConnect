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

@Table
class ContactCustomField extends Model<ContactCustomField> {
	// Definindo a chave primária com auto incremento
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number;

	// Nome do campo personalizado
	@Column(DataType.STRING)
	declare name: string;

	// Valor associado ao campo personalizado
	@Column(DataType.STRING)
	declare value: string;

	// Definindo uma chave estrangeira para associar a este campo personalizado ao Contact
	@ForeignKey(() => Contact)
	@Column(DataType.INTEGER)
	declare contactId: number;

	// Relacionamento "Pertence a" com o modelo Contact
	@BelongsTo(() => Contact)
	declare contact: Contact;

	// Data de criação do campo personalizado
	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date;

	// Data de atualização do campo personalizado
	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date;
}

export default ContactCustomField;
