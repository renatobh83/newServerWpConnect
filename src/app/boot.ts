import { Application } from "express";
import express from "./express";
import modules from "./modules";
import config from '../config/config';
export default async function bootstrap(app: Application): Promise<void> {
  await express(app, config);
  await modules(app)
}