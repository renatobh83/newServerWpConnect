import {
	AllowNull,
	AutoIncrement,
	BeforeCreate,
	BelongsTo,
	BelongsToMany,
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
import Campaign from "./Campaign";
import CampaignContacts from "./CampaignContacts";
import ContactCustomField from "./ContactCustomField";
import ContactTag from "./ContactTag";
import ContactWallet from "./ContactWallet";
import Tags from "./Tag";
import Tenant from "./Tenant";
import Ticket from "./Ticket";
import User from "./User";

@Table
class Contact extends Model<Contact> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number;

	@Column(DataType.STRING)
	declare name: string;

	@AllowNull(true)
	@Column(DataType.STRING)
	declare number: string;

	@AllowNull(true)
	@Default(null)
	@Column(DataType.STRING)
	declare email: string;

	@Column(DataType.STRING)
	declare profilePicUrl: string;

	@AllowNull(true)
	@Default(null)
	@Column(DataType.STRING)
	declare pushname: string;

	@AllowNull(true)
	@Default(null)
	@Column(DataType.STRING)
	declare telegramId: string;

	@AllowNull(true)
	@Default(null)
	@Column(DataType.STRING)
	declare messengerId: string;

	@AllowNull(true)
	@Default(null)
	@Column(DataType.INTEGER)
	declare instagramPK: number;

	@Default(false)
	@Column(DataType.BOOLEAN)
	declare isUser: boolean;

	@Default(false)
	@Column(DataType.BOOLEAN)
	declare isWAContact: boolean;

	@Default(false)
	@Column(DataType.BOOLEAN)
	declare isGroup: boolean;

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date;

	@HasMany(() => Ticket)
	declare tickets: Ticket[];

	@HasMany(() => ContactCustomField)
	declare extraInfo: ContactCustomField[];

	@BelongsToMany(
		() => Tags,
		() => ContactTag,
		"contactId",
		"tagId",
	)
	declare tags: Tags[];

	@BelongsToMany(
		() => User,
		() => ContactWallet,
		"contactId",
		"walletId",
	)
	declare wallets: ContactWallet[];

	@HasMany(() => ContactWallet)
	declare contactWallets: ContactWallet[];

	@HasMany(() => CampaignContacts)
	declare campaignContacts: CampaignContacts[];

	@BelongsToMany(
		() => Campaign,
		() => CampaignContacts,
		"contactId",
		"campaignId",
	)
	declare campaign: Campaign[];

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER)
	declare tenantId: number;

	@BelongsTo(() => Tenant)
	declare tenant: Tenant;
}

export default Contact;
