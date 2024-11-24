import { Application, json, NextFunction, urlencoded } from "express";
import helmet from "helmet";
import cors from "cors"
import cookieParser from "cookie-parser";
import { ServerOptions } from "../types/ServerOptions";
import mergeDeep from "merge-deep";
import config from "../confg/config";
import { defaultLogger } from "@wppconnect-team/wppconnect";
import { getIO } from "../libs/scoket";
import { logger } from "../utils/logger";

export default async function express(app: Application, serverOptions: Partial<ServerOptions>) {

    if (typeof serverOptions !== 'object') {
        serverOptions = {};
      }
    // serverOptions = mergeDeep({}, config, serverOptions);
    
    defaultLogger.level = serverOptions?.log?.level
    ? serverOptions.log.level
    : 'silly';
    
    
    
    app.use(helmet());
    app.use(cors())
    app.use(cookieParser());
    app.use(json({ limit: "50MB" }));

    app.use(
        urlencoded({ extended: true, limit: "50MB", parameterLimit: 200000 })
    );
    
   
    app.use((req: any, res: any, next: NextFunction) => { 
        req.serverOptions = serverOptions;
        req.io = getIO()
        next();
    })
    logger.info("express already in server!");
}