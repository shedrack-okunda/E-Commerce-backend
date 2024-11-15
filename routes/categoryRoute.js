import express from "express";
const router = express.Router();
import { getAll } from "../controllers/categoryController.js";

router.get("/", getAll);

export default router;
