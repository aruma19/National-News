import express from "express";
import {
  getNews,
  getNewById,
  createNew,
  updateNew,
  deleteNew
} from "../controllers/NewController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/news/public", getNews);
router.get("/news/public/:id", getNewById);

router.get("/news", verifyToken, getNews);
router.get("/news/:id", verifyToken, getNewById);
router.post("/news", verifyToken,createNew);
router.put("/news/:id", verifyToken, updateNew);
router.delete("/news/:id", verifyToken, deleteNew);

export default router;
