import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// karena __dirname tidak tersedia di ESM
const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

// Atur penyimpanan
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/profile')); // pastikan folder ini ada
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

export default upload;