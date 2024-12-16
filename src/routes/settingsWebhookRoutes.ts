import express from "express";
import isAuth from "../middleware/isAuth";
import * as SettingsWebhookController from "../controllers/SettingsWebhookController";
const settingsWebhookRoutes = express.Router();

settingsWebhookRoutes.get(
	"/webhooks",
	isAuth,
	SettingsWebhookController.index,
);

settingsWebhookRoutes.post("/webhooks",
	isAuth,
	SettingsWebhookController.store,)

settingsWebhookRoutes.put("/webhooks/:id",
	isAuth,
	SettingsWebhookController.update,)

settingsWebhookRoutes.delete("/webhooks/:id",
	isAuth,
	SettingsWebhookController.detele,)

export default settingsWebhookRoutes