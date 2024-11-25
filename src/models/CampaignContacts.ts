import {
	AllowNull,
	AutoIncrement,
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
import Campaign from "./Campaign";
import Contact from "./Contact";
import Message from "./Message";

@Table
class CampaignContacts extends Model<CampaignContacts> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number;

	@Default(0)
	@Column(DataType.INTEGER)
	declare ack: number;

	@Column(DataType.TEXT)
	declare body: string;

	@Column(DataType.STRING)
	declare messageRandom: string;

	@AllowNull
	@Default(null)
	@Column(DataType.STRING)
	declare mediaName: string | null;

	@Default(null)
	@AllowNull
	@Column(DataType.INTEGER)
	declare timestamp: number | null;

	@ForeignKey(() => Message)
	@Column(DataType.STRING)
	declare messageId: string;

	@BelongsTo(() => Message, "messageId")
	declare message: Message;

	@ForeignKey(() => Campaign)
	@Column(DataType.INTEGER)
	declare campaignId: number;

	@BelongsTo(() => Campaign, "campaignId")
	declare campaign: Campaign;

	@ForeignKey(() => Contact)
	@Column(DataType.INTEGER)
	declare contactId: number;

	@BelongsTo(() => Contact, "contactId")
	declare contact: Contact;

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date;
}

export default CampaignContacts;
