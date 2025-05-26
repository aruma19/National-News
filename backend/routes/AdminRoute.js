import express from "express";
import { 
    registerAdmin, 
    loginAdmin,
    logoutAdmin,
    updateAdmin 
} from "../controllers/AdminController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.post("/admin/register", registerAdmin);
router.post("/admin/login", loginAdmin);
router.post("/admin/logout", verifyToken, logoutAdmin);
//router.put("/admin/update", verifyToken, upload.single("profileAdmin"), updateAdmin);

export default router;
