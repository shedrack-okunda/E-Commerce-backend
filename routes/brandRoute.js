import express from "express";
const router = express.Router();
import { getAll } from "../controllers/brandController.js";

router.get("/", getAll);

const brandRoutes = router;
export default brandRoutes;
