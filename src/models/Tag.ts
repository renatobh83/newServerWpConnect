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
import Tenant from "./Tenant";
import User from "./User";

@Table
class Tags extends Model<Tags> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number; // ID da tag (auto incremento)

	@Column(DataType.STRING)
	declare tag: string; // Nome ou identificação da tag

	@Column(DataType.STRING)
	declare color: string; // Cor associada à tag (pode ser um valor de cor hexadecimal, por exemplo)

	@Default(true)
	@Column(DataType.BOOLEAN)
	declare isActive: boolean; // Flag indicando se a tag está ativa ou não

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date; // Data de criação da tag

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date; // Data de atualização da tag

	@ForeignKey(() => User)
	@Column(DataType.INTEGER)
	declare userId: number; // Relacionamento com o modelo User (usuário que criou a tag)

	@BelongsTo(() => User)
	declare user: User; // Relacionamento com o modelo User

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER)
	declare tenantId: number; // Relacionamento com o modelo Tenant (tenancy)

	@BelongsTo(() => Tenant)
	declare tenant: Tenant; // Relacionamento com o modelo Tenant
}

export default Tags;
