import {
	AfterFind,
	AutoIncrement,
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
	UpdatedAt,
} from "sequelize-typescript";
import CampaignContacts from "./CampaignContacts";
import Tenant from "./Tenant";
import User from "./User";
import Whatsapp from "./whatsapp";

@Table
class Campaign extends Model<Campaign> {
	[x: string]: any;
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number;

	@Column(DataType.STRING)
	declare name: string;

	@Column(DataType.DATE)
	declare start: Date;

	@Default("pending")
	@Column(
		DataType.ENUM("pending", "scheduled", "processing", "canceled", "finished"),
	)
	declare status:
		| "pending"
		| "scheduled"
		| "processing"
		| "canceled"
		| "finished";

	@Column(DataType.STRING)
	declare message1: string;

	@Column(DataType.STRING)
	declare message2: string;

	@Column(DataType.STRING)
	declare message3: string;

	@Column(DataType.STRING)
	get mediaUrl(): string | null {
		const value = this.getDataValue("mediaUrl");
		if (value && value !== "null") {
			const { BACKEND_URL } = process.env;
			return `${BACKEND_URL}:${process.env.PROXY_PORT}/public/${value}`;
		}
		return null;
	}

	@Column(DataType.STRING)
	declare mediaType: string;

	@ForeignKey(() => User)
	@Column(DataType.INTEGER)
	declare userId: number;

	@BelongsTo(() => User)
	declare user: User;

	@ForeignKey(() => Whatsapp)
	@Column(DataType.INTEGER)
	declare sessionId: number;

	@BelongsTo(() => Whatsapp)
	declare session: Whatsapp;

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER)
	declare tenantId: number;

	@BelongsTo(() => Tenant)
	declare tenant: Tenant;

	@HasMany(() => CampaignContacts)
	declare campaignContacts: CampaignContacts[];

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date;

	@Column(DataType.INTEGER)
	declare delay: number;

	@AfterFind
	static async updatedInstances(
		instances: Campaign[],
	): Promise<Campaign[] | Campaign> {
		if (!Array.isArray(instances)) return instances;

		const newInstances = (
			await Promise.all(
				instances.map(async (instance: Campaign) => {
					if (!["pending", "finished", "canceled"].includes(instance.status)) {
						const pendentesEntrega = +instance.dataValues.pendentesEntrega;
						const pendentesEnvio = +instance.dataValues.pendentesEnvio;
						const recebidas = +instance.dataValues.recebidas;
						const lidas = +instance.dataValues.lidas;
						const contactsCount = +instance.dataValues.contactsCount;

						const totalTransacionado =
							pendentesEntrega + pendentesEnvio + recebidas + lidas;

						if (
							instance.status === "scheduled" &&
							contactsCount === pendentesEnvio
						) {
							return instance;
						}

						if (contactsCount !== totalTransacionado) {
							instance.status = "processing";
							await instance.update({ status: "processing" });
						}

						if (contactsCount === totalTransacionado) {
							instance.status = "finished";
							await instance.update({ status: "finished" });
						}

						return instance;
					}
					return undefined;
				}),
			)
		).filter((instance): instance is Campaign => instance !== undefined);

		return newInstances;
	}
}

export default Campaign;
