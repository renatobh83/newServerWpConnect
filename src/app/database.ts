import "../database";
import type { Application } from "express";
import { logger } from "../utils/logger";

export default async function database(app: Application): Promise<void> {
	logger.info("database already in server!");
}
