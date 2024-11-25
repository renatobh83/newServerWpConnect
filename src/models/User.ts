import { compare, hash } from "bcryptjs";
import {
	AllowNull,
	AutoIncrement,
	BeforeCreate,
	BeforeUpdate,
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
import Contact from "./Contact";
import Queue from "./Queue";
import Tenant from "./Tenant";
import Ticket from "./Ticket";
import UsersQueues from "./UsersQueues";

@Table
class User extends Model<User> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number;

	@Column(DataType.STRING)
	declare name: string;

	@Column(DataType.STRING)
	declare email: string;

	@Column(DataType.STRING)
	declare status: string;

	@Column(DataType.VIRTUAL)
	declare password: string;

	@Column(DataType.STRING)
	declare passwordHash: string;

	@Default(0)
	@Column(DataType.INTEGER)
	declare tokenVersion: number;

	@Default("admin")
	@Column(DataType.STRING)
	declare profile: string;

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt: Date;

	@HasMany(() => Ticket)
	declare tickets: Ticket[];

	@BelongsToMany(
		() => Queue,
		() => UsersQueues,
		"userId",
		"queueId",
	)
	declare queues: Queue[];

	@BelongsToMany(
		() => Contact,
		() => Ticket,
		"userId",
		"contactId",
	)
	declare Contact: Contact[];

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER)
	declare tenantId: number;

	@BelongsTo(() => Tenant)
	declare tenant: Tenant;

	@Column(DataType.DATE)
	declare lastLogin: Date;

	@Column(DataType.DATE)
	declare lastOnline: Date;

	@Column(DataType.DATE)
	declare lastLogout: Date;

	@Column(DataType.BOOLEAN)
	declare isOnline: boolean;

	@Default({})
	@AllowNull
	@Column(DataType.JSON)
	declare configs: object;

	@BeforeUpdate
	@BeforeCreate
	static hashPassword = async (instance: User): Promise<void> => {
		if (instance.password) {
			instance.passwordHash = await hash(instance.password, 8);
		}
	};

	public checkPassword = async (password: string): Promise<boolean> => {
		return compare(password, this.getDataValue("passwordHash"));
	};
}

export default User;
