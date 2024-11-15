import express from "express";
import {
  create,
  getByProductId,
  updateById,
  deleteById,
} from "../controllers/reviewController.js";
const router = express.Router();

router
  .post("/", create)
  .get("/product/:id", getByProductId)
  .path("/:id", updateById)
  .delete("/:id", deleteById);

export default router;
