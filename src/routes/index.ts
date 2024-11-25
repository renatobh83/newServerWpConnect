import { Router } from "express";
import contactRoutes from "./contactRoutes";
import ticketRoutes from "./ticketRoutes";
import whatsappRoutes from "./whatsappRoutes";
import messageRoutes from "./messageRoutes";
import whatsappSessionRoutes from "./whatsappSessionRoutes";
import autoReplyRoutes from "./autoReplyRoutes";
import fastReplyRoutes from "./fastReplyRoutes";
import queueRoutes from "./queueRoutes";
import statisticsRoutes from "./statisticsRoutes";
import tagRoutes from "./tagRoutes";
import campaignRoutes from "./campaignRoutes";
import campaignContactsRoutes from "./campaignContactsRoutes";
import apiConfigRoutes from "./apiConfigRoutes";
import apiExternalRoutes from "./apiExternalRoutes";
import chatFlowRoutes from "./chatFlowRoutes";
import tenantRoutes from "./tenantRoutes";
import WebHooksRoutes from "./WebHooksRoutes";
import adminRoutes from "./adminRoutes";
import authRoutes from "./authRoutes";
import settingRoutes from "./settingRoutes";
import userRoutes from "./userRoutes";
// import apiConfirmacaoRoutes from "./apiConfirmacaoRoutes";
import * as prometheusRegister from "../middleware/metrics";

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

// routes.use(apiConfirmacaoRoutes);

export default routes;
