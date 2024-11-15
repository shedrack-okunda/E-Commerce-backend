import express from "express";
const router = express.Router();
import { getById, updateById } from "../controllers/userController.js";

router.get("/:id", getById).path("/:id", updateById);

export default router;
