/* eslint-disable array-callback-return */
// import AppError from "../../errors/AppError";
import * as Yup from "yup";
import AppError from "../../errors/AppError";
import CampaignContacts from "../../models/CampaignContacts";

interface CampaignContact {
	campaignId: string | number;
	contactId: number;
}

interface Request {
	campaignContacts: CampaignContact[];
	campaignId: string;
}

interface CampaignContactData {
	campaignId: string;
	contactId: number;
}

const CreateCampaignContactsService = async ({
	campaignContacts,
	campaignId,
}: Request): Promise<void> => {
	const randomInteger = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	const isCreateds = await CampaignContacts.findAll({
		where: {
			campaignId,
		},
	});

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const data: CampaignContactData[] = campaignContacts.map((contact: any) => {
		return {
			contactId: contact.id,
			campaignId,
			messageRandom: `message${randomInteger(1, 3)}`,
		};
	});

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const filterData = data.filter((d: any): any => {
		const isExists = isCreateds?.findIndex(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(c: any) => d.contactId === c.contactId && +campaignId === c.campaignId,
		);
		if (isExists === -1) {
			return d;
		}
	}) as unknown as CampaignContacts[];

	const schema = Yup.array().of(
		Yup.object().shape({
			messageRandom: Yup.string().required(),
			campaignId: Yup.number().required(),
			contactId: Yup.number().required(),
		}),
	);

	try {
		await schema.validate(filterData);
	} catch (error) {
		throw new AppError(error.message);
	}

	try {
		await CampaignContacts.bulkCreate(filterData);
	} catch (error) {
		throw new AppError(error.message);
	}
};

export default CreateCampaignContactsService;
