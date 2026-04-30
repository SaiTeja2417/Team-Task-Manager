import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/", auth, getUsers);

export default router;