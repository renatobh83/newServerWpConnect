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
import User from "./User";

@Table
class Tenant extends Model<Tenant> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number; // ID do Tenant (auto incremento)

	@Column({ defaultValue: "active", type: DataType.STRING })
	declare status: string; // Status do Tenant (por exemplo, "active", "inactive")

	@Column(DataType.STRING)
	declare name: string; // Nome do Tenant

	@ForeignKey(() => User)
	@Column(DataType.INTEGER)
	declare ownerId: number; // ID do proprietário (referência ao User)

	@BelongsTo(() => User)
	declare owner: User; // Relacionamento com o modelo User (Proprietário do Tenant)

	@Column(DataType.JSONB)
	declare businessHours: object; // Horários de funcionamento (armazenado como JSON)

	@Column({ type: DataType.STRING, allowNull: true })
	declare messageBusinessHours: string | null; // Mensagem de horários de funcionamento (opcional)

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date; // Data de criação do Tenant

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date; // Data de atualização do Tenant
}

export default Tenant;
