import express from "express";
const redisRouter = express.Router();

import * as RedisController from "../controllers/RedisController";


redisRouter.get("/redis/:queueName/stats", RedisController.stats)

export default redisRouter