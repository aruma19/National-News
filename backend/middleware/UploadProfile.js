import multer from "multer";
import path from "path";
import fs from "fs";

// Middleware upload dinamis berdasarkan peran
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Default folder jika tidak diketahui
    let role = "user";

    // Ambil dari req.userRole jika tersedia (ditambahkan dari middleware token)
    if (req.userRole === "admin") role = "admin";
    else if (req.userRole === "user") role = "user";

    const dir = `./uploads/profile/${role}`;

    // Buat folder jika belum ada
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, fileName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  }
});

export default upload;
