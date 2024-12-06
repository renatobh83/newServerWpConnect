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
import Queue from "./Queue";
import User from "./User";

@Table({ freezeTableName: true, tableName: "UsersQueues" })
class UsersQueues extends Model<UsersQueues> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER) // Correct data type for id
	declare id: number;

	@ForeignKey(() => Queue)
	@Column(DataType.INTEGER) // Correct data type for foreign key
	declare queueId: number;

	@BelongsTo(() => Queue)
	declare queue: Queue;

	@ForeignKey(() => User)
	@Column(DataType.INTEGER) // Correct data type for foreign key
	declare userId: number;

	@BelongsTo(() => User)
	declare user: User;

	@CreatedAt
	@Column(DataType.DATE) // Correct data type for timestamps
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE) // Correct data type for timestamps
	declare updatedAt: Date;
}

export default UsersQueues;
