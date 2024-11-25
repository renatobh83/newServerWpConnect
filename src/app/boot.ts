import type { Application } from "express";
import config from "../config/config";
import waitForPostgresConnection from "./awaitPostgresConnection";
import database from "./database";
import express from "./express";
import modules from "./modules";

export default async function bootstrap(app: Application): Promise<void> {
	await waitForPostgresConnection();
	await database(app);
	await express(app, config);
	await modules(app);
}
