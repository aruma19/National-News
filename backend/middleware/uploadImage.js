import multer from "multer";
import path from "path";

// Tentukan folder penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");  // pastikan folder uploads ada di root project
  },
  filename: (req, file, cb) => {
    // buat nama unik: timestamp + ekstensi asli
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Filter file gambar (jpg, jpeg, png)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar JPG, JPEG, PNG yang diizinkan"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
