import { Router } from "express";
import { getWbot, initWbot } from "../libs/wbot";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";

const routes = Router();


routes.get("/", (req, res)=> {
   
    res.json("routes in modules")
})
routes.get("/session", async (req,res)=> {
    const a = {
        id: 34343,
        type: "whatsapp"
    }
    await StartWhatsAppSession(a)
    res.json("session")
})

export default routes;