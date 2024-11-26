import {
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
import { v4 as uuidV4 } from "uuid";
import Tenant from "./Tenant";
import User from "./User";
import Whatsapp from "./Whatsapp";

@Table({ freezeTableName: true, tableName: "ApiConfigs" }) // Adicionado o decorador @Table
class ApiConfig extends Model<ApiConfig> {
	@PrimaryKey
	@Default(uuidV4)
	@Column(DataType.UUID)
	declare id: string;

	@ForeignKey(() => Whatsapp)
	@Column(DataType.INTEGER) // Definido o tipo INTEGER para sessionId
	sessionId: number;

	@BelongsTo(() => Whatsapp)
	session: Whatsapp;

	@Column(DataType.STRING) // Adicionado DataType.STRING para name
	name: string;

	@Default(true)
	@Column(DataType.BOOLEAN) // Definido o tipo BOOLEAN para isActive
	isActive: boolean;

	@Column(DataType.STRING) // Adicionado DataType.STRING para token
	token: string;

	@Column(DataType.STRING) // Adicionado DataType.STRING para authToken
	authToken: string;

	@Column(DataType.STRING) // Adicionado DataType.STRING para urlServiceStatus
	urlServiceStatus: string;

	@Column(DataType.STRING) // Adicionado DataType.STRING para urlMessageStatus
	urlMessageStatus: string;

	@ForeignKey(() => User)
	@Column(DataType.INTEGER) // Definido o tipo INTEGER para userId
	userId: number;

	@BelongsTo(() => User)
	user: User;

	@CreatedAt
	@Column(DataType.DATE(6)) // Definido DataType.DATE(6) para createdAt
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6)) // Definido DataType.DATE(6) para updatedAt
	declare updatedAt: Date;

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER) // Definido o tipo INTEGER para tenantId
	tenantId: number;

	@BelongsTo(() => Tenant)
	tenant: Tenant;
}

export default ApiConfig;
