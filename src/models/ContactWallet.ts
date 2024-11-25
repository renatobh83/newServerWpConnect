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
import Tenant from "./Tenant";
import User from "./User";

@Table
class ContactWallet extends Model<ContactWallet> {
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

	// Chave estrangeira para associar ao modelo User (Wallet)
	@ForeignKey(() => User)
	@Column(DataType.INTEGER)
	declare walletId: number;

	// Relacionamento "Pertence a" com o modelo User (Wallet)
	@BelongsTo(() => User)
	declare wallet: User;

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

export default ContactWallet;
