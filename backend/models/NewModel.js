import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const New = db.define('news', {
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  iso_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  image_small: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image_large: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
}, {
  freezeTableName: true,
  timestamps: true
});

export default New;
