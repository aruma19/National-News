import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import NewRoute from "./routes/NewRoute.js";
import CommentRoute from './routes/CommentRoute.js';
import CategoryRoute from "./routes/CategoryRoute.js";
import AdminRoute from "./routes/AdminRoute.js";
import LikeRoute from "./routes/LikeRoute.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import db from "./config/Database.js";
import path from "path";


// Import models dan asosiasi agar relasi aktif
import "./models/UserModel.js";
import "./models/NewModel.js";
import "./models/CategoryModel.js";
import "./models/AdminModel.js";
import "./models/LikeModel.js";
import "./models/associations.js";

dotenv.config();

const app = express();
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => res.render("index"));

app.use(UserRoute);
app.use(NewRoute);
app.use(CategoryRoute);
app.use(CommentRoute);
app.use(AdminRoute);
app.use(LikeRoute);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

(async () => {
  try {
    await db.sync(); 
    console.log("Database synced!");
    
    app.listen(5003, () => console.log("Server connected on port 5003"));
  } catch (error) {
    console.error("DB Sync Error:", error);
  }
})();
