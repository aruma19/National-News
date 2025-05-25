import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Like = db.define("likes", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  newsId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},{
    freezeTableName: true,
  timestamps: true, // createdAt dan updatedAt otomatis
});

export default Like;
  