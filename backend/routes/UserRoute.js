import express from "express";
import {
  registerUser,
  loginHandler,
  logout,
  updateUser,
  registerAdmin,
  getMe
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import upload from "../middleware/upload.js";


const router = express.Router();

router.get("/token", refreshToken);
router.post("/register", registerUser);
router.post("/register/admin", registerAdmin);
router.post("/login", loginHandler);
router.post("/logout", verifyToken, logout);
router.put("/user/update", verifyToken, upload.single("photo"), updateUser);
router.get("/me", verifyToken, getMe);

export default router;
//bismillah
