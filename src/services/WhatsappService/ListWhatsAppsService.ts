import Whatsapp from "../../models/whatsapp";

const ListWhatsAppsService = async (
	tenantId: string | number,
): Promise<Whatsapp[]> => {
	const whatsapps = await Whatsapp.findAll({
		where: {
			tenantId,
			// type: "w"
		},
	});

	return whatsapps;
};

export default ListWhatsAppsService;
