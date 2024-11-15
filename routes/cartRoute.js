import express from "express";
const router = express.Router();
import {
  create,
  getByUserId,
  updateById,
  deleteById,
  deleteByUserId,
} from "../controllers/cartController.js";

router
  .post("/", create)
  .get("/user/:id", getByUserId)
  .patch("/:id", updateById)
  .delete("/:id", deleteById)
  .delete("/user/:id", deleteByUserId);

const cartRoutes = router;
export default cartRoutes;
