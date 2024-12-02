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
} from 'sequelize-typescript';
import Tenant from './Tenant';
import User from './User';
interface ChatFlowAttributes {
	id?: number;
	name: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	flow?: any; // JSON data structure, type defined as 'any' for flexibility
	isActive?: boolean;
	isDeleted?: boolean;
	celularTeste?: string | null;
	userId: number;
	user?: User;
	tenantId: number;
	tenant?: Tenant;
	createdAt?: Date;
	updatedAt?: Date;
}

@Table({ freezeTableName: true })
class ChatFlow extends Model<ChatFlowAttributes> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	declare id: number;

	@Column(DataType.TEXT)
	declare name: string;

	@Default({})
	@AllowNull
	@Column(DataType.JSON)
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	declare flow: any;

	@Default(true)
	@Column(DataType.BOOLEAN)
	declare isActive: boolean;

	@Default(false)
	@Column(DataType.BOOLEAN)
	declare isDeleted: boolean;

	@Default(null)
	@Column(DataType.TEXT)
	declare celularTeste?: string | null;

	@ForeignKey(() => User)
	@Column(DataType.INTEGER)
	declare userId: number;

	@BelongsTo(() => User)
	declare user: User;

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER)
	declare tenantId: number;

	@BelongsTo(() => Tenant)
	declare tenant: Tenant;

	@CreatedAt
	@Column(DataType.DATE(6))
	declare createdAt?: Date;

	@UpdatedAt
	@Column(DataType.DATE(6))
	declare updatedAt?: Date;

	tableName: 'ChatFlow';

	// Método getter ajustado para o flow
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	get flowData(): any {
		const flow = this.getDataValue('flow');
		if (flow) {
			for (const node of flow.nodeList) {
				if (node.type === 'node') {
					for (const item of node.data.interactions) {
						if (item.type === 'MediaField' && item.data.mediaUrl) {
							const { BACKEND_URL, PROXY_PORT } = process.env;
							const file = item.data.mediaUrl;
							item.data.fileName = file;
							item.data.mediaUrl = `${BACKEND_URL}:${PROXY_PORT}/public/${file}`;
						}
					}
				}
			}
			return flow;
		}
		return {};
	}
}

export default ChatFlow;

// /* eslint-disable no-restricted-syntax */
// import {
// 	AllowNull,
// 	AutoIncrement,
// 	BelongsTo,
// 	Column,
// 	CreatedAt,
// 	DataType,
// 	Default,
// 	ForeignKey,
// 	Model,
// 	PrimaryKey,
// 	Table,
// 	UpdatedAt,
// } from "sequelize-typescript";
// import Tenant from "./Tenant";
// import User from "./User";

// @Table({ freezeTableName: true })
// class ChatFlow extends Model<ChatFlow> {
// 	@PrimaryKey
// 	@AutoIncrement
// 	@Column
// 	declare id: number;

// 	@Column(DataType.TEXT)
// 	name: string;

// 	@Default({})
// 	@AllowNull
// 	@Column(DataType.JSON)
// 	get flow(): any {
// 		const flow = this.getDataValue("flow");
// 		if (flow) {
// 			for (const node of flow.nodeList) {
// 				if (node.type === "node") {
// 					for (const item of node.data.interactions) {
// 						if (item.type === "MediaField" && item.data.mediaUrl) {
// 							const { BACKEND_URL, PROXY_PORT } = process.env;
// 							const file = item.data.mediaUrl;
// 							item.data.fileName = file;
// 							item.data.mediaUrl = `${BACKEND_URL}:${PROXY_PORT}/public/${file}`;
// 						}
// 					}
// 				}
// 			}
// 			return flow;
// 		}
// 		return {};
// 	}

// 	@Default(true)
// 	@Column
// 	isActive: boolean;

// 	@Default(false)
// 	@Column
// 	isDeleted: boolean;

// 	@Default(null)
// 	@Column(DataType.TEXT)
// 	celularTeste: string;

// 	@ForeignKey(() => User)
// 	@Column
// 	userId: number;

// 	@BelongsTo(() => User)
// 	user: User;

// 	@ForeignKey(() => Tenant)
// 	@Column
// 	tenantId: number;

// 	@BelongsTo(() => Tenant)
// 	tenant: Tenant;

// 	@CreatedAt
// 	@Column(DataType.DATE(6))
// 	declare createdAt: Date;

// 	@UpdatedAt
// 	@Column(DataType.DATE(6))
// 	declare updatedAt: Date;

// 	tableName: "ChatFlow";
// }

// export default ChatFlow;
