import {
	Model,
	Table,
	Column,
	DataType,
	PrimaryKey,
	AutoIncrement,
	CreatedAt,
	UpdatedAt,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import Tenant from "./Tenant";

@Table({
	tableName: "Kanbans", // Nome da tabela no banco (opcional)
	timestamps: true, // Habilita timestamps
})
export default class Kanban extends Model<Kanban> {
	@PrimaryKey // Define como chave primária
	@AutoIncrement // Define como auto-incrementado
	@Column // Define que é uma coluna no banco
	declare id: number; // Tipo do campo (não nulo)

	@Column // Define como uma coluna no banco
	name!: string; // Nome do kanban

	@CreatedAt // Indica a data de criação automática
	@Column(DataType.DATE(6)) // Define o tipo Date com precisão de milissegundos
	declare createdAt: Date;

	@UpdatedAt // Indica a data de atualização automática
	@Column(DataType.DATE(6)) // Define o tipo Date com precisão de milissegundos
	declare updatedAt: Date;

	@ForeignKey(() => Tenant) // Define como chave estrangeira referenciando Tenant
	@Column // Define que é uma coluna no banco
	tenantId!: number;

	@BelongsTo(() => Tenant) // Define a associação BelongsTo com Tenant
	tenant!: Tenant;
}
