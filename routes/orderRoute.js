import express from "express";
const router = express.Router();
import {
  create,
  getAll,
  getByUserId,
  updateById,
} from "../controllers/orderController.js";

router
  .post("/", create)
  .get("/", getAll)
  .get("/user/:id", getByUserId)
  .patch("/:id", updateById);

const orderRoutes = router;
export default orderRoutes;
