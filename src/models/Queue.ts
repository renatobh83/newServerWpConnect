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

interface QueueAttributes {
	id?: number;
	queue: string;
	isActive: boolean;
	userId: number;
	tenantId: number;
	createdAt?: Date;
	updatedAt?: Date;
}
@Table
class Queue extends Model<QueueAttributes> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER) // Especificando explicitamente o tipo de dado
	declare id: number;

	@Column(DataType.STRING) // Definindo explicitamente o tipo de dado para 'queue'
	queue: string;

	@Default(true)
	@Column(DataType.BOOLEAN) // Especificando o tipo booleano para 'isActive'
	isActive: boolean;

	@Column(DataType.DATE) // Definindo explicitamente o tipo de dado para 'createdAt'
	@CreatedAt
	declare createdAt: Date;

	@Column(DataType.DATE) // Definindo explicitamente o tipo de dado para 'updatedAt'
	@UpdatedAt
	declare updatedAt: Date;

	@ForeignKey(() => User)
	@Column(DataType.INTEGER) // Definindo explicitamente o tipo de dado para 'userId' como inteiro
	declare userId: number; // 'userId' é uma chave estrangeira para o modelo 'User'

	@BelongsTo(() => User) // Estabelecendo o relacionamento com 'User'
	declare user: User;

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER) // Definindo explicitamente o tipo de dado para 'tenantId' como inteiro
	declare tenantId: number; // 'tenantId' é uma chave estrangeira para o modelo 'Tenant'

	@BelongsTo(() => Tenant) // Estabelecendo o relacionamento com 'Tenant'
	declare tenant: Tenant;
}

export default Queue;
