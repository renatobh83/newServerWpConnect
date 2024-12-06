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

interface ApiConfigAttributes {
	id: string;
	sessionId: number;
	name: string;
	isActive: boolean;
	token?: string;
	authToken?: string;
	urlServiceStatus?: string;
	urlMessageStatus?: string;
	userId: number;
	tenantId: number;
	createdAt: Date;
	updatedAt: Date;
}



@Table({ freezeTableName: true, tableName: "ApiConfigs" }) // Adicionado o decorador @Table
class ApiConfig extends Model<ApiConfigAttributes> {
	@PrimaryKey
	@Default(uuidV4)
	@Column(DataType.UUID)
	declare id: string;

	@ForeignKey(() => Whatsapp)
	@Column(DataType.INTEGER) // Definido o tipo INTEGER para sessionId
	declare sessionId: number;

	@BelongsTo(() => Whatsapp)
	session: Whatsapp;

	@Column(DataType.STRING) // Adicionado DataType.STRING para name
	declare name: string;

	@Default(true)
	@Column(DataType.BOOLEAN) // Definido o tipo BOOLEAN para isActive
	declare isActive: boolean;

	@Column(DataType.STRING) // Adicionado DataType.STRING para token
	declare token: string;

	@Column(DataType.STRING) // Adicionado DataType.STRING para authToken
	declare authToken: string;

	@Column(DataType.STRING) // Adicionado DataType.STRING para urlServiceStatus
	declare urlServiceStatus: string;

	@Column(DataType.STRING) // Adicionado DataType.STRING para urlMessageStatus
	declare urlMessageStatus: string;

	@ForeignKey(() => User)
	@Column(DataType.INTEGER) // Definido o tipo INTEGER para userId
	declare userId: number;

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
	declare tenantId: number;

	@BelongsTo(() => Tenant)
	tenant: Tenant;
}

export default ApiConfig;
