import express, { Express, NextFunction } from "express"

import { createServer } from "http";
import bootstrap from "./boot";
import { initIO } from "../libs/scoket";


export default async function application() { 
    const app: any = express();
    const httpServer: any = createServer(app);
    const PORT =  3100;
    await bootstrap(app);
    
    async function start() {
        const host = app.get("host") || "0.0.0.0";
        app.server = httpServer.listen(PORT, host, async () => {
          console.info(`Web server listening at: http://${host}:${PORT}/`);
        });

        initIO(app.server)
        
       
      }
    
    app.start = start;
    
    return app
}