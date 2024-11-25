import express from "express";
import multer from "multer";
import uploadConfig from "../config/upload";
import isAPIAuth from "../middleware/isAPIAuth";

import * as APIExternalController from "../controllers/APIExternalController";
import isAuth from "../middleware/isAuth";

const apiExternalRoute = express.Router();

const upload = multer({
	...uploadConfig,
	limits: {
		files: 1, // allow only 1 file per request
		fileSize: 1024 * 1024 * 5, // 5 MB (max file size)
	},

	// fileFilter: (req, file, cb) => {
	//   console.log(file);
	//   console.log(req);
	//   console.log(cb);
	// }
});

apiExternalRoute.post(
	"/v1/api/external/:apiId",
	isAPIAuth,
	upload.single("media"),
	APIExternalController.sendMessageAPI,
);

apiExternalRoute.post(
	"/v1/api/external/:apiId/start-session",
	isAPIAuth,
	APIExternalController.startSession,
);

// apiExternalRoute.post(
// 	"/v1/api/external/:apiId/:idWbot/:authToken",
// 	APIExternalController.sendMessageConfirmacao,
// );

// apiExternalRoute.get("/teste", APIExternalController.TESTEAPIWEBHOOKS);
export default apiExternalRoute;
