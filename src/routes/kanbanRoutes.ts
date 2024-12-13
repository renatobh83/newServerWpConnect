import express from "express";

const kanbanRoutes = express.Router();
import * as KanbanController from "../controllers/KanbanController";
import isAuth from "../middleware/isAuth";

kanbanRoutes.post("/kanban", isAuth, KanbanController.store);
kanbanRoutes.get("/kanban", isAuth, KanbanController.index);
kanbanRoutes.put("/kanban/:kanbanId", isAuth, KanbanController.update);
kanbanRoutes.delete("/kanban/:kanbanId", isAuth, KanbanController.remove);

export default kanbanRoutes;
