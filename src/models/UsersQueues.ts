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
import webHooks from "../config/webHooks.dev.json";
import authConfig from "../config/auth";
import Queue from "../libs/Queue";
import ApiConfig from "./ApiConfig";
import ChatFlow from "./ChatFlow";
import Tenant from "./Tenant";
import Ticket from "./Ticket";

@Table
class Whatsapp extends Model<Whatsapp> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number;

	@AllowNull(false)
	@Unique
	@Column(DataType.TEXT)
	declare name: string;

	@Column(DataType.TEXT)
	session: string;

	@Column(DataType.TEXT)
	qrcode: string;

	@Column(DataType.STRING)
	status: string;

	@Column(DataType.INTEGER)
	battery: number;

	@Column(DataType.BOOLEAN)
	plugged: boolean;

	@Default(true)
	@Column(DataType.BOOLEAN)
	isActive: boolean;

	@Default(false)
	@Column(DataType.BOOLEAN)
	isDeleted: boolean;

	@Column(DataType.INTEGER)
	retries: number;

	@Default(false)
	@Column(DataType.BOOLEAN)
	isDefault: boolean;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	tokenTelegram: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	instagramUser: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	instagramKey: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	fbPageId: string;

	@Default(null)
	@AllowNull
	@Column(DataType.JSONB)
	// eslint-disable-next-line @typescript-eslint/ban-types
	fbObject: object;

	@Default("whatsapp")
	@Column(DataType.ENUM("whatsapp", "telegram", "instagram", "messenger"))
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
	wppUser: string;

	@Default(false)
	@Column(DataType.BOOLEAN)
	pairingCodeEnabled: boolean;

	@AllowNull
	@Column(DataType.STRING)
	pairingCode: string;

	@Column(DataType.JSONB)
	// eslint-disable-next-line @typescript-eslint/ban-types
	phone: object;

	@HasMany(() => Ticket)
	tickets: Ticket[];

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER)
	tenantId: number;

	@BelongsTo(() => Tenant)
	tenant: Tenant;

	@ForeignKey(() => ChatFlow)
	@Column(DataType.INTEGER)
	chatFlowId: number;

	@BelongsTo(() => ChatFlow)
	chatFlow: ChatFlow;

	@Default(null)
	@AllowNull
	@Column(DataType.ENUM("360", "gupshup"))
	wabaBSP: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	tokenAPI: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	tokenHook: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)
	farewellMessage: string;

	@Column(DataType.VIRTUAL)
	get UrlWabaWebHook(): string | null {
		const key = this.getDataValue("tokenHook");
		const wabaBSP = this.getDataValue("wabaBSP");
		let BACKEND_URL;
		BACKEND_URL = process.env.BACKEND_URL;
		if (process.env.NODE_ENV === "dev") {
			BACKEND_URL = webHooks.urlWabahooks;
		}
		return `${BACKEND_URL}/wabahooks/${wabaBSP}/${key}`;
	}

	@Column(DataType.VIRTUAL)
	get UrlMessengerWebHook(): string | null {
		const key = this.getDataValue("tokenHook");
		let BACKEND_URL;
		BACKEND_URL = process.env.BACKEND_URL;
		if (process.env.NODE_ENV === "dev") {
			BACKEND_URL = webHooks.urlWabahooks;
		}
		return `${BACKEND_URL}/fb-messenger-hooks/${key}`;
	}

	@AfterUpdate
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
					return Queue.add("WebHooksAPI", {
						url: api.urlServiceStatus,
						type: payload.type,
						payload,
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
