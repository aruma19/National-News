import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Comment = db.define("comments", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  newsId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  timestamps: true, // createdAt dan updatedAt otomatis
});

export default Comment;
