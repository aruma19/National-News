import express from "express";
import {
  getNews,
  getNewById,
  createNew,
  updateNew,
  deleteNew
} from "../controllers/NewController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { isAdmin } from "../middleware/RoleMiddleware.js";

const router = express.Router();

router.get("/news", verifyToken, getNews);
router.get("/news/:id", verifyToken, getNewById);
router.post("/news", verifyToken, isAdmin, createNew);
router.put("/news/:id", verifyToken, isAdmin, updateNew);
router.delete("/news/:id", verifyToken, isAdmin, deleteNew);

export default router;
