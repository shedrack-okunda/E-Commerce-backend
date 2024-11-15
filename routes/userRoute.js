import express from "express";
const router = express.Router();
import { getById, updateById } from "../controllers/userController.js";

router.get("/:id", getById).patch("/:id", updateById);

const userRoutes = router;
export default userRoutes;
