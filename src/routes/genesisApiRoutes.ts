import express from "express";
import * as ApiGenesisController from "../api/Genesis/controllers/apiController"

const ApiGenesisRouter = express.Router();

ApiGenesisRouter.post(
    "/v1/api/external/:apiId/:idWbot/:authToken",
    ApiGenesisController.actionsApiGenesis,
);


export default ApiGenesisRouter