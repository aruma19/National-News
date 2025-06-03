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


const router = express.Router();

router.get("/token", refreshToken);
router.post("/register", registerUser);
router.post("/register/admin", registerAdmin);
router.post("/login", loginHandler);
router.delete("/logout", verifyToken, logout);
router.put("/user/update", verifyToken, updateUser);
router.get("/me", verifyToken, getMe);

export default router;
//bismillah
