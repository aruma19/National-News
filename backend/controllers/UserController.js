import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import Admin from "../models/AdminModel.js";

async function registerUser(req, res) {
  try {
    const { username, email, gender, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, gender, password: hashed });
    res.status(201).json({ status: "Success", message: "User registered", data: user });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
}

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

//Nambah fungsi buat login handler
async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;

    // Cek di tabel user
    let user = await User.findOne({ where: { email } });
    let role = "user";

    // Kalau tidak ditemukan, cek ke admin
    if (!user) {
      user = await Admin.findOne({ where: { email } });
      role = "admin";
    }

    if (!user) {
      return res.status(400).json({ status: "Failed", message: "Email atau password salah" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ status: "Failed", message: "Email atau password salah" });
    }

    const userPlain = user.toJSON();
    const { password: _, refresh_token: __, ...safeUserData } = userPlain;
    safeUserData.role = role;

    const accessToken = jwt.sign(safeUserData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(safeUserData, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Simpan token ke user/admin sesuai role
    if (role === "user") {
      await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });
    } else {
      await Admin.update({ refresh_token: refreshToken }, { where: { id: user.id } });
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "Success",
      message: "Login berhasil",
      safeUserData,
      accessToken,
    });

  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
}

//nambah logout
async function logout(req, res) {
  try {
    const role = req.role;
    const id = role === "admin" ? req.adminId : req.userId;

    const model = role === "admin" ? Admin : User;
    await model.update({ refresh_token: null }, { where: { id } });

    res.status(200).json({ message: `${role} logout berhasil dan token dibersihkan.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// async function updateUser(req, res) {
//   try {
//     const userId = req.userId;     // dari verifyToken middleware
//     const role = req.role;         // role: "user" atau "admin"
//     const { username, email, gender, password } = req.body;

//     let model = role === "admin" ? Admin : User;
//     let user = await model.findByPk(userId);
//     if (!user) return res.status(404).json({ message: `${role} tidak ditemukan` });

//     // Hash password jika ingin diubah
//     let hashedPassword = user.password;
//     if (password) {
//       hashedPassword = await bcrypt.hash(password, 10);
//     }

//     // Handle foto profil
//     let profileField = role === "admin" ? "profileAdmin" : "profileUser";
//     let profilePath = user[profileField];
//     if (req.file) {
//       profilePath = `/uploads/profile/${role}/${req.file.filename}`;
//     }

//     await user.update({
//       username: username || user.username,
//       email: email || user.email,
//       gender: gender || user.gender,
//       password: hashedPassword,
//       [profileField]: profilePath,
//     });

//     res.json({ message: `Data ${role} berhasil diperbarui` });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// dalam UserController.js
async function getMe(req, res) {
  try {
    const role = req.role;
    const userId = role === "admin" ? req.adminId : req.userId;
    const model = role === "admin" ? Admin : User;

    const user = await model.findByPk(userId, {
      attributes: ["id", "username", "email", "gender"]
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export {registerUser,loginHandler, logout, updateUser, registerAdmin, getMe};
