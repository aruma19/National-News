import express from "express";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/CategoryController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { isAdmin } from "../middleware/RoleMiddleware.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/categories/:id", getCategoryById);
router.post("/categories", verifyToken, isAdmin, createCategory);
router.put("/categories/:id", verifyToken, isAdmin, updateCategory);
router.delete("/categories/:id", verifyToken, isAdmin, deleteCategory);

export default router;
