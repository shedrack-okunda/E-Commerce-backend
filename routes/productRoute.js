import express from "express";
const router = express.Router();
import {
  create,
  getAll,
  getById,
  updateById,
  undeleteById,
  deleteById,
} from "../controllers/productController.js";

router
  .post("/", create)
  .get("/", getAll)
  .get("/:id", getById)
  .patch("/:id", updateById)
  .patch("/undelete/:id", undeleteById)
  .delete("/:id", deleteById);

const productRoutes = router;
export default productRoutes;
