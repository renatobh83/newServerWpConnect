import {
	AllowNull,
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
import User from "./User";

@Table({ freezeTableName: true })
class FastReply extends Model<FastReply> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER) // Definido como inteiro, já que é auto-incremento
	declare id: number;

	@AllowNull(false)
	@Column(DataType.STRING) // Definido como string para armazenar chaves
	declare key: string;

	@AllowNull(false)
	@Column(DataType.TEXT) // Definido como TEXT, pois normalmente mensagens são mais longas
	declare message: string;

	@ForeignKey(() => User)
	@Column(DataType.INTEGER) // Chave estrangeira para User, geralmente é inteiro
	declare userId: number;

	@BelongsTo(() => User)
	declare user: User;

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER) // Chave estrangeira para Tenant, também geralmente inteiro
	declare tenantId: number;

	@BelongsTo(() => Tenant)
	declare tenant: Tenant;

	@CreatedAt
	@Column(DataType.DATE(6)) // Tipo de dado para data e hora com precisão de milissegundos
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6)) // Tipo de dado para data e hora com precisão de milissegundos
	declare updatedAt: Date;

	tableName: "FastReply"; // Definido explicitamente o nome da tabela
}

export default FastReply;
