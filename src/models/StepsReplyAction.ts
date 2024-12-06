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
import Queue from "./Queue";
import StepsReply from "./StepsReply";
import User from "./User";

@Table({ freezeTableName: true, tableName: "StepsReplyActions" })
class StepsReplyActions extends Model<StepsReplyActions> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER) // Alterado para INTEGER
	declare id: number; // id como número, considerando AutoIncrement

	@ForeignKey(() => StepsReply)
	@Column(DataType.INTEGER) // Definido tipo INTEGER para chave estrangeira
	declare stepReplyId: number;

	@BelongsTo(() => StepsReply, "stepReplyId")
	 stepsReply: StepsReply;

	@Column(DataType.STRING)
	declare words: string;

	@Default(null)
	@Column(DataType.TEXT)
	declare replyDefinition: string;

	@Column(DataType.INTEGER) // Ação como número (INTEGER)
	declare action: number;

	@ForeignKey(() => User)
	@Column(DataType.INTEGER) // Definido como INTEGER
	declare userId: number; // Representa o usuário associado

	@BelongsTo(() => User)
	user: User;

	@CreatedAt
	@Column(DataType.DATE(6)) // Definido com precisão de data
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6)) // Definido com precisão de data
	declare updatedAt: Date;

	@ForeignKey(() => Queue)
	@Column(DataType.INTEGER) // Chave estrangeira para a Queue
	declare queueId: number;

	@BelongsTo(() => Queue)
	queue: Queue;

	@ForeignKey(() => User)
	@Column(DataType.INTEGER) // Chave estrangeira para o usuário de destino
	userIdDestination: number;

	@BelongsTo(() => User)
	userDestination: User; // Relacionamento com o usuário de destino

	@ForeignKey(() => StepsReply)
	@Column(DataType.INTEGER) // Chave estrangeira para o próximo passo
	declare nextStepId: number;

	@BelongsTo(() => StepsReply, "nextStepId")
	nextStep: StepsReply; // Relacionamento com o próximo passo
}

export default StepsReplyActions;
