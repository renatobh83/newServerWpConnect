import { format, formatISO, parse } from "date-fns";
import AppError from "../../errors/AppError";
import socketEmit from "../../helpers/socketEmit";
import Contact from "../../models/Contact";
import ContactCustomField from "../../models/ContactCustomField";
import ContactWallet from "../../models/ContactWallet";

interface ExtraInfo {
	id?: number;
	name: string;
	value: string;
}

interface Wallet {
	walletId: number;
	contactId: number;
	tenantId: number;
}

interface ContactData {
	email?: string;
	number?: string;
	name?: string;
	extraInfo?: ExtraInfo[];
	wallets?: null | number[] | string[];
	dtaniversario?: Date | null;
	empresa?: string;
	identifier?: string;
}

interface Request {
	contactData: ContactData;
	contactId: number;
	tenantId: number;
}

const UpdateContactService = async ({
	contactData,
	contactId,
	tenantId,
}: Request): Promise<Contact> => {
	const {
		email,
		name,
		number,
		extraInfo,
		wallets,
		empresa,
		dtaniversario,
		identifier,
	} = contactData;

	const contact = await Contact.findOne({
		where: { id: contactId, tenantId },
		attributes: ["id", "name", "number", "email", "profilePicUrl"],
		include: [
			"extraInfo",
			"tags",
			{
				association: "wallets",
				attributes: ["id", "name"],
			},
		],
	});
	if (!contact) {
		throw new AppError("ERR_NO_CONTACT_FOUND", 404);
	}

	if (extraInfo) {
		await Promise.all(
			extraInfo.map(async (info) => {
				await ContactCustomField.upsert({ ...info, contactId: contact.id });
			}),
		);

		await Promise.all(
			contact.extraInfo.map(async (oldInfo) => {
				const stillExists = extraInfo.findIndex(
					(info) => info.id === oldInfo.id,
				);

				if (stillExists === -1) {
					await ContactCustomField.destroy({ where: { id: oldInfo.id } });
				}
			}),
		);
	}

	if (wallets) {
		await ContactWallet.destroy({
			where: {
				tenantId,
				contactId,
			},
		});

		const contactWallets: Wallet[] = [];
		// biome-ignore lint/complexity/noForEach: <explanation>
		wallets.forEach((wallet: any) => {
			contactWallets.push({
				walletId: !wallet.id ? wallet : wallet.id,
				contactId,
				tenantId,
			});
		});

		await ContactWallet.bulkCreate(contactWallets);
	}

	await contact.update({
		name,
		number,
		email,
		empresa,
		dtaniversario: new Date(formatISO(dtaniversario)),
		identifier,
	});

	await contact.reload({
		attributes: ["id", "name", "number", "email", "profilePicUrl"],
		include: [
			"extraInfo",
			"tags",
			{
				association: "wallets",
				attributes: ["id", "name"],
			},
		],
	});

	socketEmit({
		tenantId,
		type: "contact:update",
		payload: contact,
	});

	return contact;
};

export default UpdateContactService;
