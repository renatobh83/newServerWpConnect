import { Sequelize } from "sequelize";
import FarewellMessage from "../../models/FarewellMessage";

export const ListFarewellMessageService = async ({
	searchParam = "",
	pageNumber = "1",
	tenantId,
}) => {
	if (!tenantId) {
		throw new Error("Tenant ID is required");
	}

	const page = Number.parseInt(pageNumber, 10);
	if (Number.isNaN(page) || page < 1) {
		throw new Error("Invalid page number");
	}

	const searchCondition = {
		tenantId,
		message: Sequelize.where(
			Sequelize.fn("LOWER", Sequelize.col("message")),
			"ILIKE", // Use ILIKE para PostgreSQL
			`%${searchParam.toLowerCase().trim()}%`,
		),
	};

	const offset = 40 * (page - 1);

	const queryOptions = {
		where: searchCondition,
		limit: 40,
		offset,
		order: [["message", "ASC"]],
	};

	const { count, rows } = await FarewellMessage.findAndCountAll(queryOptions);

	const hasMore = count > offset + rows.length;

	return {
		farewellMessage: rows,
		count,
		hasMore,
	};
};
