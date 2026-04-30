import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getTasks, createTask, updateTask } from "../controllers/taskController.js";

const router = express.Router();

router.get("/", auth, getTasks);
router.post("/", auth, createTask);
router.put("/:id", auth, updateTask);

export default router;