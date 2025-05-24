import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

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

//Nambah fungsi buat login handler
async function loginHandler(req, res){
  try{
      const{email, password} = req.body;
      const user = await User.findOne({
          where : {
              email: email
          }
      });

      if(user){
        //Data User itu nanti bakalan dipake buat ngesign token kan
        // data user dari sequelize itu harus diubah dulu ke bentuk object
        //Safeuserdata dipake biar lebih dinamis, jadi dia masukin semua data user kecuali data-data sensitifnya  karena bisa didecode kayak password caranya gini :
        const userPlain = user.toJSON(); // Konversi ke object
        const { password: _, refresh_token: __, ...safeUserData } = userPlain;


          const decryptPassword = await bcrypt.compare(password, user.password);
          if(decryptPassword){
                safeUserData.role = "user";

              const accessToken = jwt.sign(safeUserData, process.env.ACCESS_TOKEN_SECRET, {
                  expiresIn : '30m' 
              });
              const refreshToken = jwt.sign(safeUserData, process.env.REFRESH_TOKEN_SECRET, {
                  expiresIn : '1d' 
              });
              await User.update({refresh_token:refreshToken},{
                  where:{
                      id:user.id
                  }
              });
              res.cookie('refreshToken', refreshToken,{
                  httpOnly : true, //ngatur cross-site scripting, untuk penggunaan asli aktifkan karena bisa nyegah serangan fetch data dari website "document.cookies"
                  sameSite : 'none',  //ini ngatur domain yg request misal kalo strict cuman bisa akseske link dari dan menuju domain yg sama, lax itu bisa dari domain lain tapi cuman bisa get
                  maxAge  : 24*60*60*1000,
                  secure:true //ini ngirim cookies cuman bisa dari https, kenapa? nyegah skema MITM di jaringan publik, tapi pas development di false in aja
              });
              res.status(200).json({
                  status: "Succes",
                  message: "Login Berhasil",
                  safeUserData,
                  accessToken 
              });
              console.log('Body:', req.body);

          }
          else{
              res.status(400).json({
                  status: "Failed",
                  message: "Password atau email salah",
                
              });
          }
      } else{
          res.status(400).json({
              status: "Failed",
              message: "Paassword atau email salah",
          });
      }
  } catch(error){
      res.status(error.statusCode || 500).json({
          status: "error",
          message: error.message
      })
  }
}

//nambah logout
async function logout(req, res) {
  try {
    const userId = req.userId;
    await User.update({ refresh_token: null }, { where: { id: userId } });
    res.status(200).json({ message: "Logout berhasil dan token dibersihkan." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.userId;  // dari verifyToken middleware
    const { username, email, gender, password } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    // Jika mau update password, hash dulu
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    let profileUser = user.profileUser;
    if (req.file) {
       profileUser = req.file ? `/uploads/profile/user/${req.file.filename}` : user.profileUser;
    }

    await user.update({
      username: username || user.username,
      email: email || user.email,
      gender: gender || user.gender,
      password: hashedPassword,
      profileUser,
    });

    res.json({ message: "Data user berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {registerUser,loginHandler, logout, updateUser};
