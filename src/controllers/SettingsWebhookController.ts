import { NextFunction, Request, RequestHandler, Response } from "express";
import AppError from "../errors/AppError";
import ListSettingsWebhookServices from "../services/SettingsWebhookServices/ListSettingsWebhookServices";
import { CreateSettingsWebhookServices } from "../services/SettingsWebhookServices/CreateSettingsWebhookServices";
import { DeleteSettingsWebhookServices } from "../services/SettingsWebhookServices/DeleteSettingsWebhookServices";
import { UpdateSettingsWebhookServices } from "../services/SettingsWebhookServices/UpdateSettingsWebhookServices";


export const index: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { tenantId } = req.user;

  if (req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }
  try {

    const apis = await ListSettingsWebhookServices({ tenantId });
    res.status(200).json(apis);
  } catch (error) {
    next(error)
  }
};

export const store: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { tenantId } = req.user;

  if (req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }
  try {
    const { expDate, action, nomeApi, usuario, senha, baseURl, status } = req.body
    const api = await CreateSettingsWebhookServices({ action, baseURl, expDate, nomeApi, senha, usuario, tenantId, status });
    res.status(200).json(api);
  } catch (error) {
    next(error)
  }
};
export const update: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { tenantId } = req.user;
  const { id } = req.params
  if (req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }
  try {
    const { expDate, action, nomeApi, usuario, senha, baseURl } = req.body
    const api = await UpdateSettingsWebhookServices({ action, baseURl, expDate, nomeApi, senha, usuario, tenantId, id });
    res.status(200).json(api);
  } catch (error) {
    next(error)
  }
};

export const detele: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { tenantId } = req.user;
  const { id } = req.params
  if (req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }
  try {

    const api = await DeleteSettingsWebhookServices({ tenantId, id });
    res.status(200).json(api);
  } catch (error) {
    next(error)
  }
};