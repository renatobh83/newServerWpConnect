import {
	AfterCreate,
	AfterUpdate,
	AllowNull,
	BelongsTo,
	Column,
	CreatedAt,
	DataType,
	Default,
	ForeignKey,
	Model,
	PrimaryKey,
	UpdatedAt,
} from "sequelize-typescript";
import { v4 as uuidV4 } from "uuid";
import Queue from "../libs/Queue";
import Tenant from "./Tenant";
import Whatsapp from "./whatsapp";

class ApiMessage extends Model<ApiMessage> {
	[x: string]: any;
	@PrimaryKey
	@Default(uuidV4)
	@Column(DataType.UUID)
	declare id: string;

	@ForeignKey(() => Whatsapp)
	@Column(DataType.INTEGER) // Definido como INTEGER
	sessionId: number;

	@BelongsTo(() => Whatsapp)
	session: Whatsapp;

	@Default(0)
	@Column(DataType.INTEGER) // Definido como INTEGER
	ack: number;

	@PrimaryKey
	@Column(DataType.STRING) // Definido como STRING
	messageId: string;

	@Column(DataType.TEXT) // Definido como TEXT
	body: string;

	@AllowNull(false)
	@Column(DataType.STRING) // Definido como STRING
	number: string; // Alterado para STRING caso o número tenha algum formato específico como e.g., +55...

	@Column(DataType.STRING) // Definido como STRING
	mediaName: string;

	@Column(DataType.STRING) // Definido como STRING
	mediaUrl: string;

	@Column(DataType.STRING) // Definido como STRING
	externalKey: string;

	@Default(null)
	@AllowNull(true)
	@Column(DataType.INTEGER) // Definido como INTEGER
	timestamp: number | null;

	@Default(null)
	@AllowNull(true)
	@Column(DataType.JSONB) // Definido como JSONB
	messageWA: object | null;

	@Default(null)
	@AllowNull(true)
	@Column(DataType.JSONB) // Definido como JSONB
	apiConfig: object | null;

	@CreatedAt
	@Column(DataType.DATE(6)) // Definido como DATE(6)
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6)) // Definido como DATE(6)
	declare updatedAt: Date;

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER) // Definido como INTEGER
	tenantId: number;

	@BelongsTo(() => Tenant)
	tenant: Tenant;

	tableName: "ApiMessages";

	@AfterCreate
	@AfterUpdate
	static HookMessage(instance: ApiMessage | any): void {
		if (instance?.apiConfig?.urlMessageStatus) {
			const payload = {
				ack: instance.ack,
				body: instance.body,
				messageId: instance.messageId,
				number: instance.number,
				externalKey: instance.externalKey,
				type: "hookMessageStatus",
				authToken: instance.authToken, // Assumindo que 'authToken' seja um campo de ApiMessage
			};

			Queue.add("WebHooksAPI", {
				url: instance.apiConfig.urlMessageStatus,
				type: payload.type,
				payload,
			});
		}
	}
}

export default ApiMessage;
