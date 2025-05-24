import express from "express";
import {
  registerUser,
  loginHandler,
  logout,
  updateUser
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import upload from "../middleware/uploadImage.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginHandler);
router.post("/logout", verifyToken, logout);
router.put("/user/update", verifyToken, upload.single("profileUser"), updateUser);

export default router;
