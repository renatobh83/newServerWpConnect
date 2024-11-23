import { Router } from "express";
import { initWbot } from "../libs/wbot";

const routes = Router();


routes.get("/", (req, res)=> {
        initWbot("s")
    res.json("routes in modules")
})

export default routes;