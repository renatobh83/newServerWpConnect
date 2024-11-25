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
import Tenant from "./Tenant";

@Table
class Setting extends Model<Setting> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number; // ID da configuração (auto incremento)

	@Column(DataType.STRING)
	declare key: string; // Chave da configuração (por exemplo, 'theme', 'language', etc.)

	@Column(DataType.STRING)
	declare value: string; // Valor da configuração (por exemplo, 'dark', 'en', etc.)

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date; // Data de criação do registro de configuração

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date; // Data de atualização do registro de configuração

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER)
	declare tenantId: number; // Relacionamento com o modelo Tenant

	@BelongsTo(() => Tenant)
	declare tenant: Tenant; // Relacionamento com o Tenant (deve existir um Tenant relacionado)
}

export default Setting;
