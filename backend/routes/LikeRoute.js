import express from "express";
import { 
  likeNews, 
  getLikedNews,
  unLikedNews ,
  checkLikeStatus,
  getLikeCount
} from "../controllers/LikeController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.post("/news/liked", verifyToken, likeNews);
router.get("/news/liked", verifyToken, getLikedNews); // Ambil semua berita yg disukai user
router.get("/news/liked/check/:id", verifyToken, checkLikeStatus); // Cek apakah berita ini disukai
router.delete("/news/liked/:id", verifyToken, unLikedNews);
router.get("/news/:id/likesCount",verifyToken, getLikeCount);

export default router;
