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
  .patch("/:id", updateById)
  .delete("/:id", deleteById);

const reviewRoutes = router;
export default reviewRoutes;
