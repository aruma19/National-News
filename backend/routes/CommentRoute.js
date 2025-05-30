import express from "express";
import {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  getCommentsByNews
} from "../controllers/CommentController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/comments", verifyToken, getComments);
router.get("/comments/:id", verifyToken, getCommentById);
router.post("/comments", verifyToken, createComment);
router.put("/comments/:id", verifyToken, updateComment);
router.delete("/comments/:id", verifyToken, deleteComment);

router.get("/comments/news/:newsId", verifyToken, getCommentsByNews);

export default router;
