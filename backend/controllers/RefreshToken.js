import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import Admin from "../models/AdminModel.js";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    // Cari di User
    let user = await User.findOne({ where: { refresh_token: refreshToken } });
    let role = "user";

    // Kalau tidak ada, cek di Admin
    if (!user) {
      user = await Admin.findOne({ where: { refresh_token: refreshToken } });
      role = "admin";
    }

    if (!user || !user.refresh_token) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);

      const userPlain = user.toJSON();
      const { password: _, refresh_token: __, ...safeUserData } = userPlain;
      safeUserData.role = role;

      const accessToken = jwt.sign(safeUserData, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30s'
      });

      res.json({ accessToken });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
