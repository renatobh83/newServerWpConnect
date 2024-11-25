import {
	AutoIncrement,
	BelongsTo,
	Column,
	CreatedAt,
	DataType,
	Default,
	ForeignKey,
	HasMany,
	Model,
	PrimaryKey,
	Table,
	UpdatedAt,
} from "sequelize-typescript";
import StepsReply from "./StepsReply";
import Tenant from "./Tenant";
import User from "./User";

@Table({ freezeTableName: true })
class AutoReply extends Model<AutoReply> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number;

	@Column(DataType.TEXT)
	declare name: string;

	@Default(null)
	@Column(DataType.TEXT)
	declare celularTeste: string | null;

	@Default(true)
	@Column(DataType.BOOLEAN)
	declare isActive: boolean;

	@Default(0)
	@Column(DataType.INTEGER)
	declare action: number;

	@ForeignKey(() => User)
	@Column(DataType.INTEGER)
	declare userId: number;

	@BelongsTo(() => User)
	declare user: User;

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date;

	@HasMany(() => StepsReply)
	declare stepsReply: StepsReply[];

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER)
	declare tenantId: number;

	@BelongsTo(() => Tenant)
	declare tenant: Tenant;

	tableName: "AutoReply";
}

export default AutoReply;
