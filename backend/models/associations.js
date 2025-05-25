import User from "./UserModel.js";
import Admin from "./AdminModel.js";
import New from "./NewModel.js";
import Category from "./CategoryModel.js";
import Comment from "./CommentModel.js";
import Like from "./LikeModel.js";

// Relasi Admin - News
User.hasMany(New, { foreignKey: 'adminId' });
New.belongsTo(Admin, { foreignKey: 'adminId' });

// Relasi Category - News
Category.hasMany(New, { foreignKey: 'categoryId' });
New.belongsTo(Category, { foreignKey: 'categoryId' });

// Relasi Admin - Comments
Admin.hasMany(Comment, { foreignKey: 'adminId' });
Comment.belongsTo(Admin, { foreignKey: 'adminId' });
// Relasi User - Comments
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

// Relasi News - Comments
New.hasMany(Comment, { foreignKey: 'newsId' });
Comment.belongsTo(New, { foreignKey: 'newsId' });

// Relasi User - Like
User.hasMany(Like, { foreignKey: "userId" });
Like.belongsTo(User, { foreignKey: "userId" });

//Relasi berita - like
New.hasMany(Like, { foreignKey: "newsId" });
Like.belongsTo(New, { foreignKey: "newsId" });   

export { User, New, Category, Comment, Like };
