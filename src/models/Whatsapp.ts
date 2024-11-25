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
	@Column(DataType.STRING)  // Alterado para STRING para texto de comprimento variável
	declare name: string;

	@Column(DataType.STRING)  // Alterado para STRING
	session: string;

	@Column(DataType.STRING)  // Alterado para STRING
	qrcode: string;

	@Column(DataType.STRING)  // Alterado para STRING
	status: string;

	@Column(DataType.INTEGER)  // Alterado para INTEGER
	battery: number;

	@Column(DataType.BOOLEAN)  // Alterado para BOOLEAN
	plugged: boolean;

	@Default(true)
	@Column(DataType.BOOLEAN)  // Alterado para BOOLEAN
	isActive: boolean;

	@Default(false)
	@Column(DataType.BOOLEAN)  // Alterado para BOOLEAN
	isDeleted: boolean;

	@Column(DataType.INTEGER)  // Alterado para INTEGER
	retries: number;

	@Default(false)
	@Column(DataType.BOOLEAN)  // Alterado para BOOLEAN
	isDefault: boolean;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)  // Alterado para STRING
	tokenTelegram: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)  // Alterado para STRING
	instagramUser: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)  // Alterado para STRING
	instagramKey: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)  // Alterado para STRING
	fbPageId: string;

	@Default(null)
	@AllowNull
	@Column(DataType.JSONB)  // Usando JSONB para objetos JSON
	// eslint-disable-next-line @typescript-eslint/ban-types
	fbObject: object;

	@Default("whatsapp")
	@Column(DataType.ENUM("whatsapp", "telegram", "instagram", "messenger"))  // Usando ENUM para tipos específicos
	declare type: string;

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date;

	@Column(DataType.STRING)  // Alterado para STRING
	declare number: string;

	@AllowNull
	@Column(DataType.STRING)  // Alterado para STRING
	wppUser: string;

	@Default(false)
	@Column(DataType.BOOLEAN)  // Alterado para BOOLEAN
	pairingCodeEnabled: boolean;

	@AllowNull
	@Column(DataType.STRING)  // Alterado para STRING
	pairingCode: string;

	@Column(DataType.JSONB)  // Usando JSONB para objetos JSON
	// eslint-disable-next-line @typescript-eslint/ban-types
	phone: object;

	@HasMany(() => Ticket)
	tickets: Ticket[];

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER)  // Alterado para INTEGER
	tenantId: number;

	@BelongsTo(() => Tenant)
	tenant: Tenant;

	@ForeignKey(() => ChatFlow)
	@Column(DataType.INTEGER)  // Alterado para INTEGER
	chatFlowId: number;

	@BelongsTo(() => ChatFlow)
	chatFlow: ChatFlow;

	@Default(null)
	@AllowNull
	@Column(DataType.ENUM("360", "gupshup"))  // Usando ENUM para valores específicos
	wabaBSP: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)  // Alterado para STRING
	tokenAPI: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)  // Alterado para STRING
	tokenHook: string;

	@Default(null)
	@AllowNull
	@Column(DataType.STRING)  // Alterado para STRING
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
