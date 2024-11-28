import type { Application } from "express";
import config from "../config/config";
import waitForPostgresConnection from "./awaitPostgresConnection";
import bullMq from "./bull";
import database from "./database";
import express from "./express";
import modules from "./modules";

export default async function bootstrap(app: Application): Promise<void> {
	await waitForPostgresConnection();
	await express(app, config);
	await database(app);
	await modules(app);
	await bullMq(app); // precisar subir na instancia dos bots
}
