import express from "express";
import {
  registerUser,
  loginHandler,
  logout,
  //updateUser,
  registerAdmin,
  getMe
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/VerifyToken.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/register/admin", registerAdmin);
router.post("/login", loginHandler);
router.post("/logout", verifyToken, logout);
//router.put("/user/update", verifyToken, upload.single("profileUser"), updateUser);
router.get("/me", verifyToken, getMe);

export default router;
//bismillah
