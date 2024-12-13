import {
	Model,
	Table,
	Column,
	PrimaryKey,
	AutoIncrement,
	ForeignKey,
	BelongsTo,
	DataType,
	CreatedAt,
	UpdatedAt,
} from "sequelize-typescript";
import User from "./User";
import Tenant from "./Tenant";

@Table
class FarewellMessage extends Model<FarewellMessage> {
	@PrimaryKey
	@AutoIncrement
	@Column
	declare id: string;

	@Column(DataType.TEXT)
	groupId!: string;

	@Column(DataType.TEXT)
	message!: string; // Altere o tipo se necessário, dependendo da estrutura do "message"

	@ForeignKey(() => User)
	@Column
	userId!: number;

	@BelongsTo(() => User)
	user!: User;

	@ForeignKey(() => Tenant)
	@Column
	tenantId!: number;

	@BelongsTo(() => Tenant)
	tenant!: Tenant;

	@CreatedAt
	declare createdAt: Date;

	@UpdatedAt
	declare updatedAt: Date;
}

export default FarewellMessage;
