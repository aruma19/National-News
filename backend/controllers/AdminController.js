import Admin from "../models/AdminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register Admin
async function registerAdmin(req, res) {
  const { username, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({ message: "Email sudah digunakan" });
    }

    const hash = await bcrypt.hash(password, 10);
    await Admin.create({ username, email, password: hash });

    res.status(201).json({ message: "Admin berhasil didaftarkan" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Login Admin
async function loginAdmin(req, res) {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin tidak ditemukan" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: "admin",
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ accessToken: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Logout Admin
async function logoutAdmin(req, res) {
  try {
    const adminId = req.adminId;

    // Hapus token refresh dari database jika digunakan
    await Admin.update({ refresh_token: null }, { where: { id: adminId } });

    res.status(200).json({ message: "Logout berhasil dan token dibersihkan." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// async function updateAdmin(req, res) {
//   try {
//     const adminId = req.adminId;  // dari verifyToken middleware
//     const { username, email, password } = req.body;

//     const admin = await Admin.findByPk(adminId);
//     if (!admin) return res.status(404).json({ message: "Admin tidak ditemukan" });

//     // Jika mau update password, hash dulu
//     let hashedPassword = admin.password;
//     if (password) {
//       hashedPassword = await bcrypt.hash(password, 10);
//     }

//     let profileAdmin = admin.profileAdmin;
//     if (req.file) {
//        profileAdmin = req.file ? `/uploads/profile/admin/${req.file.filename}` : user.profileAdmin;
//     }

//     await admin.update({
//       username: username || admin.username,
//       email: email || admin.email,
//       password: hashedPassword,
//       profileAdmin,
//     });

//     res.json({ message: "Data admin berhasil diperbarui" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export {registerAdmin,loginAdmin, logoutAdmin};