import express from "express";
import multer from "multer";
import uploadConfig from "../config/upload";
import isApiAuth from "../middleware/isAPIAuth";

import * as apiExternalController from "../controllers/APIExternalController";
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
	isApiAuth,
	upload.single("media"),
	apiExternalController.sendMessageAPI,
);

apiExternalRoute.post(
	"/v1/api/external/:apiId/start-session",
	isApiAuth,
	apiExternalController.startSession,
);

// apiExternalRoute.post(
// 	"/v1/api/external/:apiId/:idWbot/:authToken",
// 	APIExternalController.sendMessageConfirmacao,
// );

// apiExternalRoute.get("/teste", APIExternalController.TESTEAPIWEBHOOKS);
export default apiExternalRoute;
