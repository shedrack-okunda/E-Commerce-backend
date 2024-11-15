import express from "express";
const router = express.Router();
import {
  create,
  getByUserId,
  updateById,
  deleteById,
} from "../controllers/wishlistController.js";

router
  .post("/", create)
  .get("/user/:id", getByUserId)
  .patch("/:id", updateById)
  .delete("/:id", deleteById);

const wishlistRoutes = router;
export default wishlistRoutes;
