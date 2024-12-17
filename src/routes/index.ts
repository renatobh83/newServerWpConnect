import { Router } from "express";
// import apiConfirmacaoRoutes from "./apiConfirmacaoRoutes";
import * as prometheusRegister from "../middleware/metrics";
import WebHooksRoutes from "./WebHooksRoutes";
import adminRoutes from "./adminRoutes";
import apiConfigRoutes from "./apiConfigRoutes";
import apiExternalRoutes from "./apiExternalRoutes";
import authRoutes from "./authRoutes";
import autoReplyRoutes from "./autoReplyRoutes";
import campaignContactsRoutes from "./campaignContactsRoutes";
import campaignRoutes from "./campaignRoutes";
import chatFlowRoutes from "./chatFlowRoutes";
import contactRoutes from "./contactRoutes";
import fastReplyRoutes from "./fastReplyRoutes";
import messageRoutes from "./messageRoutes";
import queueRoutes from "./queueRoutes";
import settingRoutes from "./settingRoutes";
import statisticsRoutes from "./statisticsRoutes";
import tagRoutes from "./tagRoutes";
import tenantRoutes from "./tenantRoutes";
import ticketRoutes from "./ticketRoutes";
import userRoutes from "./userRoutes";
import whatsappRoutes from "./whatsappRoutes";
import whatsappSessionRoutes from "./whatsappSessionRoutes";
import redisRouter from "./redis";
import farewellMessageRoutes from "./farewellMessageRoutes";
import kanbanRoutes from "./kanbanRoutes";
import settingsWebhookRoutes from "./settingsWebhookRoutes";
import ApiGenesisRouter from "./genesisApiRoutes";

const routes = Router();

routes.get("/metrics", prometheusRegister.metricsHtml);
routes.use(userRoutes);
routes.use("/auth", authRoutes);
routes.use(settingRoutes);
routes.use(contactRoutes);
routes.use(ticketRoutes);
routes.use(whatsappRoutes);
routes.use(messageRoutes);
routes.use(whatsappSessionRoutes);
routes.use(autoReplyRoutes);
routes.use(fastReplyRoutes);
routes.use(queueRoutes);
routes.use(statisticsRoutes);
routes.use(tagRoutes);
routes.use(campaignRoutes);
routes.use(campaignContactsRoutes);
routes.use(apiConfigRoutes);
routes.use(apiExternalRoutes);
routes.use(chatFlowRoutes);
routes.use(tenantRoutes);
routes.use(WebHooksRoutes);
routes.use(redisRouter);
routes.use(farewellMessageRoutes);
routes.use(kanbanRoutes);
routes.use(settingsWebhookRoutes)
routes.use(ApiGenesisRouter)
// routes.use(apiConfirmacaoRoutes);

export default routes;
