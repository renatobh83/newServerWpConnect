import {
	AllowNull,
	AutoIncrement,
	BeforeSave,
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
import Tenant from "./Tenant";

@Table({ tableName: "ApiConfirmacao" })
class ApiConfirmacao extends Model<ApiConfirmacao> {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER) // Definido como INTEGER
	declare id: number;

	@Default(null)
	@AllowNull(true) // Permitindo null
	@Column(DataType.STRING) // Definido como STRING
	token: string | null;

	@Default(null)
	@AllowNull(true) // Permitindo null
	@Column(DataType.STRING) // Definido como STRING
	status: string | null;

	@Default(null)
	@AllowNull(true) // Permitindo null
	@Column(DataType.STRING) // Definido como STRING
	token2: string | null;

	@Column(DataType.STRING) // Definido como STRING
	usuario: string;

	@ForeignKey(() => Tenant)
	@Column(DataType.INTEGER) // Definido como INTEGER
	tenantId: number;

	@Column(DataType.STRING) // Definido como STRING
	senha: string;

	@AllowNull(true)
	@Column(DataType.JSONB) // Definido como JSONB
	action: string[] | null;

	@AllowNull(true)
	@Column(DataType.STRING) // Definido como STRING
	nomeApi: string | null;

	@AllowNull(true)
	@Column(DataType.STRING) // Definido como STRING
	baseURl: string | null;

	@Column(DataType.DATE(6)) // Definido DataType.DATE(6)
	expDate: Date | null;

	@CreatedAt
	@Column(DataType.DATE(6)) // Definido DataType.DATE(6)
	declare createdAt: Date;

	@UpdatedAt
	@Column(DataType.DATE(6)) // Definido DataType.DATE(6)
	declare updatedAt: Date;

	@BeforeSave
	static async calcularDataExpira(api: ApiConfirmacao) {
		if (api.token) {
			const payloadBase64 = api.token.split(".")[1];
			const payloadJson = Buffer.from(payloadBase64, "base64").toString(
				"utf-8",
			);
			const payload = JSON.parse(payloadJson);

			const expTimestamp = payload.exp;
			const expDate = new Date(expTimestamp * 1000);
			api.expDate = expDate; // Definindo a data de expiração
		} else {
			api.expDate = null;
		}
	}
}

export default ApiConfirmacao;
