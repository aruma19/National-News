import express from "express";
import upload from "../middleware/uploadImage.js";

const router = express.Router();

// Upload 1 gambar
router.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Gambar tidak ditemukan" });
    // Kirim URL/path gambar yang disimpan
    res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
