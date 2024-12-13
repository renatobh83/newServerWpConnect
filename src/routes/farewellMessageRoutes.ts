import express from "express";
import isAuth from "../middleware/isAuth";

import * as FarewellMessageController from "../controllers/FarewellMessageController";
const farewellMessageRoutes = express.Router();

farewellMessageRoutes.get(
	"/farewellMessage",
	isAuth,
	FarewellMessageController.index,
);

farewellMessageRoutes.get(
	"/farewellMessage/:farewellMessageId",
	isAuth,
	FarewellMessageController.show,
);

farewellMessageRoutes.post(
	"/farewellMessage",
	isAuth,
	FarewellMessageController.store,
);

farewellMessageRoutes.put(
	"/farewellMessage/:farewellMessageId",
	isAuth,
	FarewellMessageController.update,
);

farewellMessageRoutes.delete(
	"/farewellMessage/:farewellMessageId",
	isAuth,
	FarewellMessageController.remove,
);

farewellMessageRoutes.delete(
	"/farewellMessageAll",
	isAuth,
	FarewellMessageController.removeAll,
);

export default farewellMessageRoutes;
