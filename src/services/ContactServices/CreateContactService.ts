import AppError from "../../errors/AppError";
import socketEmit from "../../helpers/socketEmit";
import Contact from "../../models/Contact";
import ContactWallet from "../../models/ContactWallet";

interface Wallet {
	walletId: number;
	contactId: number;
	tenantId: number;
}

interface Request {
	name: string;
	number: string;
	email?: string;
	profilePicUrl?: string;
	extraInfo?: [];
	tenantId: number;
	wallets?: null | number[] | string[];
}

const CreateContactService = async ({
	name,
	number,
	email = "",
	extraInfo = [],
	tenantId,
	wallets,
}: Request): Promise<Contact> => {
	const numberExists = await Contact.findOne({
		where: { number, tenantId },
	});

	if (numberExists) {
		throw new AppError("ERR_DUPLICATED_CONTACT");
	}

	const contact = await Contact.create(
		{
			name,
			number,
			email,
			extraInfo,
			tenantId,
		},
		{
			include: [
				"extraInfo",
				"tags",
				{
					association: "wallets",
					attributes: ["id", "name"],
				},
			],
		},
	);

	if (wallets) {
		await ContactWallet.destroy({
			where: {
				tenantId,
				contactId: contact.id,
			},
		});

		const contactWallets: Wallet[] = [];
		// biome-ignore lint/complexity/noForEach: se
		wallets.forEach((wallet: any) => {
			contactWallets.push({
				walletId: !wallet.id ? wallet : wallet.id,
				contactId: contact.id,
				tenantId,
			});
		});

		await ContactWallet.bulkCreate(contactWallets);
	}

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

export default CreateContactService;
