import * as Yup from "yup";
import AppError from "../errors/AppError";
import { getIO } from "../libs/scoket";
import { ListFarewellMessageService } from "../services/FarewellMessageServices/ListFarewellMessageService";
import { CreateFarewellMessageService } from "../services/FarewellMessageServices/CreateFarewellMessageService";
import { ShowFarewellMessageService } from "../services/FarewellMessageServices/ShowFarewellMessageService";
import { UpdateFarewellMessageService } from "../services/FarewellMessageServices/UpdateFarewellMessageService";
import { DeleteFarewellMessageService } from "../services/FarewellMessageServices/DeleteFarewellMessageService";
import { DeleteAllFarewellMessagesService } from "../services/FarewellMessageServices/DeleteAllFarewellMessageService";

export const index = async (req, res, next) => {
	const { searchParam, pageNumber } = req.query;
	const { tenantId } = req.user;
	const params = { searchParam, pageNumber, tenantId };
	try {
		const { farewellMessage, count, hasMore } =
			await ListFarewellMessageService(params);
		return res.json({ farewellMessage, count, hasMore });
	} catch (error) {
		next(error);
	}
};

export const store = async (req, res, next) => {
	const { tenantId, id: userId } = req.user;
	const { message, whatsappId, groupId } = req.body;

	const schema = Yup.object().shape({
		groupId: Yup.string().required(),
		message: Yup.string().required(),
		userId: Yup.number().required(),
		tenantId: Yup.number().required(),
	});
	try {
		const createdMessages = [];
		for (const group of groupId) {
			const messageData = {
				message,
				whatsappId,
				groupId: group.id,
				userId: Number.parseInt(userId),
				tenantId,
			};
			try {
				await schema.validate(messageData);
				const createdMessage = await CreateFarewellMessageService(messageData);
				createdMessages.push(createdMessage);
			} catch (error) {
				throw new AppError(error.message);
			}
		}

		return res.status(200).json(createdMessages);
	} catch (error) {
		next(error);
	}
};

export const show = async (req, res, next) => {
	const { farewellMessageId } = req.params;
	try {
		const farewellMessage = await ShowFarewellMessageService(farewellMessageId);
		return res.status(200).json(farewellMessage);
	} catch (error) {
		next(error);
	}
};

export const update = async (req, res, next) => {
	const { tenantId } = req.user;
	const data = { ...req.body, userId: req.user.id, tenantId };

	const schema = Yup.object().shape({
		groupId: Yup.string(),
		message: Yup.string(),
		userId: Yup.number().required(),
	});

	try {
		await schema.validate(data);
	} catch (error) {
		throw new AppError(error.message);
	}
	try {
		const { farewellMessageId } = req.params;
		const params = { farewellMessageData: data, farewellMessageId };
		const updatedMessage = await UpdateFarewellMessageService(params);

		const io = getIO();
		io.emit("farewellMessage", {
			action: "update",
			farewellMessage: updatedMessage,
		});

		return res.status(200).json(updatedMessage);
	} catch (error) {
		next(error);
	}
};
export const remove = async (req, res, next) => {
	const { tenantId } = req.user;
	const { farewellMessageId } = req.params;

	try {
		await DeleteFarewellMessageService(farewellMessageId, tenantId);

		const io = getIO();
		io.emit("farewellMessage", { action: "delete", farewellMessageId });

		return res.status(200).json({ message: "Farewell Message deleted" });
	} catch (error) {
		next(error);
	}
};

export const removeAll = async (req, res, next) => {
	try {
		const { tenantId } = req.user;
		await DeleteAllFarewellMessagesService(tenantId);

		const io = getIO();
		io.emit("farewellMessage", { action: "delete" });

		return res.status(200).json({ message: "All Farewell Message deleted" });
	} catch (error) {
		next(error);
	}
};
