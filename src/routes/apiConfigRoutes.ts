import express from "express";
import isAuth from "../middleware/isAuth";

import * as apiConfigController from "../controllers/APIConfigController";

const apiConfigRoutes = express.Router();

apiConfigRoutes.post("/api-config", isAuth, apiConfigController.store);
apiConfigRoutes.get("/api-config", isAuth, apiConfigController.index);
apiConfigRoutes.put("/api-config/:apiId", isAuth, apiConfigController.update);
apiConfigRoutes.delete(
	"/api-config/:apiId",
	isAuth,
	apiConfigController.remove,
);
apiConfigRoutes.put(
	"/api-config/renew-token/:apiId",
	isAuth,
	apiConfigController.renewTokenApi,
);
export default apiConfigRoutes;
