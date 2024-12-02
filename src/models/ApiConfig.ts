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
	id?: string;
	sessionId: number;
	session?: Whatsapp;
	name: string;
	isActive?: boolean;
	token: string;
	authToken?: string;
	urlServiceStatus?: string;
	urlMessageStatus?: string;
	userId: number;
	user?: User;
	createdAt?: Date;
	updatedAt?: Date;
	tenantId: number;
	tenant?: Tenant;
}

@Table({ freezeTableName: true, tableName: "ApiConfigs" }) // Adicionado o decorador @Table
class ApiConfig extends Model<ApiConfigAttributes> {
	@PrimaryKey
	@Default(uuidV4)
	@Column(DataType.UUID)
	declare id: string;

	@ForeignKey(() => Whatsapp)
	@Column(DataType.INTEGER)
	declare sessionId: number;

	@BelongsTo(() => Whatsapp)
	declare session: Whatsapp;

	@Column(DataType.STRING)
	declare name: string;

	@Default(true)
	@Column(DataType.BOOLEAN)
	declare isActive: boolean;

	@Column(DataType.STRING)
	declare token: string;

	@Column(DataType.STRING)
	declare authToken: string;

	@Column(DataType.STRING)
	declare urlServiceStatus: string;

	@Column(DataType.STRING)
	declare urlMessageStatus: string;

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

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER)
	declare tenantId: number;

	@BelongsTo(() => Tenant)
	declare tenant: Tenant;
}

export default ApiConfig;
