import express from "express";
import multer from "multer";
import isAuth from "../middleware/isAuth";

import uploadConfig from "../config/upload";
import * as ContactController from "../controllers/ContactController";

const upload = multer(uploadConfig);

const contactRoutes = express.Router();

contactRoutes.get("/contacts", isAuth, ContactController.index);

contactRoutes.get("/contacts/:contactId", isAuth, ContactController.show);

contactRoutes.post("/contacts", isAuth, ContactController.store);
contactRoutes.post("/contactVcard", isAuth, ContactController.storeVcard);
contactRoutes.get(
	"/contactsNumber/:numberId",
	isAuth,
	ContactController.showNumber,
);
contactRoutes.post("/contacts/sync", isAuth, ContactController.syncContacts);

contactRoutes.put("/contacts/:contactId", isAuth, ContactController.update);

contactRoutes.delete("/contacts/:contactId", isAuth, ContactController.remove);

contactRoutes.put(
	"/contact-tags/:contactId",
	isAuth,
	ContactController.updateContactTags,
);
contactRoutes.put(
	"/contact-wallet/:contactId",
	isAuth,
	ContactController.updateContactWallet,
);

export default contactRoutes;
