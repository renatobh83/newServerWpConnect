import { sign } from "jsonwebtoken";
import {
	AfterUpdate,
	AllowNull,
	AutoIncrement,
	BeforeCreate,
	BeforeUpdate,
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
	Unique,
	UpdatedAt,
} from "sequelize-typescript";
import authConfig from "../config/auth";
import webHooks from "../config/webHooks.dev.json";
import ApiConfig from "./ApiConfig";
import ChatFlow from "./ChatFlow";
import Tenant from "./Tenant";
import Ticket from "./Ticket";
import  { addJob } from "../libs/Queue";



@Table
class Whatsapp extends Model<Whatsapp> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number;

	@AllowNull(false)
	@Unique
	@Column(DataType.STRING)
	declare name: string;

	@Column(DataType.STRING)
	declare session: string; // Removido o campo público e usado apenas a anotação do Sequelize

	@Column(DataType.STRING)
	declare qrcode: string;

	@Column(DataType.STRING)
	declare status: string;

	@Column(DataType.STRING)
	declare battery: string;

	@Column(DataType.BOOLEAN)
	declare plugged: boolean;

	@Default(true)
	@Column(DataType.BOOLEAN)
	declare isActive: boolean;

	@Default(false)
	@Column(DataType.BOOLEAN)
	declare isDeleted: boolean;

	@Column(DataType.INTEGER)
	declare retries: number;

	@Default(false)
	@Column(DataType.BOOLEAN)
	declare isDefault: boolean;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	declare tokenTelegram: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	declare instagramUser: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	declare instagramKey: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	declare fbPageId: string;

	@Default(null)
	@AllowNull
	@Column(DataType.JSONB)
	declare fbObject: object;

	@Default("whatsapp")
	@Column(DataType.STRING)
	declare type: string;

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date;

	@Column(DataType.STRING)
	declare number: string;

	@AllowNull
	@Column(DataType.STRING)
	declare wppUser: string;

	@Default(false)
	@Column(DataType.BOOLEAN)
	declare pairingCodeEnabled: boolean;

	@AllowNull
	@Column(DataType.STRING)
	declare pairingCode: string;

	@Column(DataType.JSONB)
	declare phone: object;

	@HasMany(() => Ticket)
	declare tickets: Ticket[];

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER)
	declare tenantId: number;

	@BelongsTo(() => Tenant)
	declare tenant: Tenant;

	@ForeignKey(() => ChatFlow)
	@Column(DataType.INTEGER)
	declare chatFlowId: number;

	@BelongsTo(() => ChatFlow)
	declare chatFlow: ChatFlow;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	declare wabaBSP: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	declare tokenAPI: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	declare tokenHook: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	declare farewellMessage: string;

	@Column(DataType.VIRTUAL)
	get UrlWabaWebHook(): string | null {
		const key = this.getDataValue("tokenHook");
		const wabaBsp = this.getDataValue("wabaBSP");
		let backendUrl = process.env.BACKEND_URL;
		if (process.env.NODE_ENV === "dev") {
			backendUrl = webHooks.urlWabahooks;
		}
		return `${backendUrl}/wabahooks/${wabaBsp}/${key}`;
	}

	@Column(DataType.VIRTUAL)
	get UrlMessengerWebHook(): string | null {
		const key = this.getDataValue("tokenHook");
		let backendUrl = process.env.BACKEND_URL;
		if (process.env.NODE_ENV === "dev") {
			backendUrl = webHooks.urlWabahooks;
		}
		return `${backendUrl}/fb-messenger-hooks/${key}`;
	}

	@AfterUpdate
	static async HookStatus(instance: Whatsapp & any): Promise<void> {
		const { status, name, qrcode, number, tenantId, id: sessionId } = instance;
		const payload: any = {
			name,
			number,
			status,
			qrcode,
			timestamp: Date.now(),
			type: "hookSessionStatus",
		};
		const apiConfig: any = await ApiConfig.findAll({
			where: { tenantId, sessionId },
		});

		if (!apiConfig) return;

		await Promise.all(
			apiConfig.map((api: ApiConfig) => {
				if (api.urlServiceStatus) {
					if (api.authToken) {
						payload.authToken = api.authToken;
					}
					return addJob("WebHooksAPI", {
						url: api.urlServiceStatus,
						type: payload.type,
						payload
					  });
				}
			}),
		);
	}

	@BeforeUpdate
	@BeforeCreate
	static async CreateTokenWebHook(instance: Whatsapp): Promise<void> {
		const { secret } = authConfig;

		if (
			!instance?.tokenHook &&
			(instance.type === "waba" || instance.type === "messenger")
		) {
			const tokenHook = sign(
				{
					tenantId: instance.tenantId,
					whatsappId: instance.id,
				},
				secret,
				{
					expiresIn: "10000d",
				},
			);

			instance.tokenHook = tokenHook;
		}
	}
}
export default Whatsapp;
