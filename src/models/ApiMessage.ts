import { Queue } from "bullmq";
import { env } from "../config/env";
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
import Tenant from "./Tenant";
import Whatsapp from "./Whatsapp";
import { addJob } from "../libs/Queue";

// const queue = new Queue("WebHooksAPI", {
// 	connection: {
// 		host: env.IO_REDIS_SERVER,
// 		port: +(process.env.IO_REDIS_PORT || "6379"),
// 		password: process.env.IO_REDIS_PASSWORD || undefined,
// 	},
// });
class ApiMessage extends Model<ApiMessage> {
	[x: string]: any;
	@PrimaryKey
	@Default(uuidV4)
	@Column(DataType.UUID)
	declare id: string;

	@ForeignKey(() => Whatsapp)
	@Column(DataType.INTEGER) // Definido como INTEGER
	declare sessionId: number;

	@BelongsTo(() => Whatsapp)
	declare session: Whatsapp;

	@Default(0)
	@Column(DataType.INTEGER) // Definido como INTEGER
	declare ack: number;

	@PrimaryKey
	@Column(DataType.STRING) // Definido como STRING
	declare messageId: string;

	@Column(DataType.TEXT) // Definido como TEXT
	declare body: string;

	@AllowNull(false)
	@Column(DataType.STRING) // Definido como STRING
	declare number: string; // Alterado para STRING caso o número tenha algum formato específico como e.g., +55...

	@Column(DataType.STRING) // Definido como STRING
	declare mediaName: string;

	@Column(DataType.STRING) // Definido como STRING
	declare mediaUrl: string;

	@Column(DataType.STRING) // Definido como STRING
	declare externalKey: string;

	@Default(null)
	@AllowNull(true)
	@Column(DataType.INTEGER) // Definido como INTEGER
	declare timestamp: number | null;

	@Default(null)
	@AllowNull(true)
	@Column(DataType.JSONB) // Definido como JSONB
	declare messageWA: object | null;

	@Default(null)
	@AllowNull(true)
	@Column(DataType.JSONB) // Definido como JSONB
	declare apiConfig: object | null;

	@CreatedAt
	@Column(DataType.DATE(6)) // Definido como DATE(6)
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6)) // Definido como DATE(6)
	declare updatedAt: Date;

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER) // Definido como INTEGER
	declare tenantId: number;

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

			addJob("WebHooksAPI", {
				url: instance.apiConfig.urlMessageStatus,
				type: payload.type,
				payload,
			});
		}
	}
}

export default ApiMessage;
