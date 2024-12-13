import AppError from "../errors/AppError";
import type { NextFunction, Request, Response } from "express";
import * as Yup from "yup";
import { createKanbanService } from "../services/KanbanServices/CreateKanbanService";
import { listKanbanService } from "../services/KanbanServices/ListKanbanService";
import { updateKanbanService } from "../services/KanbanServices/UpdateKanbanService";
import { deleteKanbanConfigService } from "../services/KanbanServices/DeleteKanbanService";

export const store = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId, id } = req.user;
	const extraData = {
		userId: id,
		tenantId: tenantId,
	};
	const data = Object.assign(Object.assign({}, req.body), extraData);

	const schema = Yup.object().shape({
		name: Yup.string().required(),
		tenantId: Yup.number().required(),
	});

	try {
		await schema.validate(data);
	} catch (error) {
		throw new AppError(error.message);
	}
	try {
		const kanban = await createKanbanService(data);
		res.status(200).json(kanban);
	} catch (error) {
		next(error);
	}
};

export const index = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	const filter = { tenantId: tenantId };
	try {
		const kanbans = await listKanbanService(filter);
		res.status(200).json(kanbans);
	} catch (error) {
		next(error);
	}
};

export const update = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId, id } = req.user;
	const { kanbanId } = req.params;
	const extraData = {
		userId: id,
		tenantId: tenantId,
	};
	const data = Object.assign(Object.assign({}, req.body), extraData);

	const schema = Yup.object().shape({
		name: Yup.string().required(),
		tenantId: Yup.number().required(),
	});

	try {
		await schema.validate(data);
	} catch (error) {
		throw new AppError(error.message);
	}
	try {
		const updateData = {
			kanbanData: data,
			kanbanId: kanbanId,
			tenantId: tenantId,
		};

		const updatedKanban = await updateKanbanService(updateData);
		res.status(200).json(updatedKanban);
	} catch (error) {
		next(error);
	}
};

export const remove = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	const { kanbanId } = req.params;

	const deleteData = {
		kanbanId: kanbanId,
		tenantId: tenantId,
	};
	try {
		await deleteKanbanConfigService(deleteData);

		const response = { message: "Kanban Config Deleted" };
		res.status(200).json(response);
	} catch (error) {
		next(error);
	}
};
