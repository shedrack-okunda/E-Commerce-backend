import express from "express";
import {
  create,
  getByUserId,
  updateById,
  deleteById,
} from "../controllers/addressController.js";
const router = express.Router();

router
  .post("/", create)
  .get("/user/:id", getByUserId)
  .patch("/:id", updateById)
  .delete("/:id", deleteById);

const addressRoutes = router;
export default addressRoutes;
