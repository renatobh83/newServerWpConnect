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
import AutoReply from "./AutoReply";
import StepsReplyAction from "./StepsReplyAction";
import User from "./User";

@Table({ freezeTableName: true, tableName: "StepsReply" })
class StepsReply extends Model<StepsReply> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER) // Alterado para INTEGER
	declare id: number; // Alterado para number

	@Column(DataType.TEXT)
	reply: string;

	@Default(false)
	@Column(DataType.BOOLEAN)
	initialStep: boolean;

	@ForeignKey(() => AutoReply)
	@Column(DataType.INTEGER) // Alterado para INTEGER
	idAutoReply: number;

	@BelongsTo(() => AutoReply, "idAutoReply")
	autoReply: AutoReply;

	@ForeignKey(() => User)
	@Column(DataType.INTEGER) // Alterado para INTEGER
	userId: number;

	@BelongsTo(() => User)
	user: User;

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date;

	@HasMany(() => StepsReplyAction)
	stepsReplyAction: StepsReplyAction;
}

export default StepsReply;
