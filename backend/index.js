import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import LikeRoute from "./routes/LikeRoute.js";
import NewRoute from "./routes/NewRoute.js";
import CommentRoute from './routes/CommentRoute.js';
import CategoryRoute from "./routes/CategoryRoute.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import db from "./config/Database.js";
import path from "path";

// Import models dan asosiasi agar relasi aktif
import "./models/UserModel.js";
import "./models/LikeModel.js";
import "./models/NewModel.js";
import "./models/CategoryModel.js";
import "./models/AdminModel.js";
import "./models/CommentModel.js";
import "./models/associations.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(cors({ credentials: true, origin: "https://national-news-dot-f-08-450706.uc.r.appspot.com" }));
app.use(express.json());

app.use(UserRoute);
app.use(NewRoute);
app.use(LikeRoute);
app.use(CategoryRoute);
app.use(CommentRoute);

const port = process.env.PORT;

//app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

(async () => {
  try {
    await db.sync();
    console.log("Database synced!");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("DB Sync Error:", error);
  }
})();
