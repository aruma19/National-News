import User from "./UserModel.js";
import New from "./NewModel.js";
import Category from "./CategoryModel.js";
import Comment from "./CommentModel.js";
import Like from "./LikeModel.js";

// Relasi User - News
User.hasMany(New, { foreignKey: 'userId' });
New.belongsTo(User, { foreignKey: 'userId' });

// Relasi Category - News
Category.hasMany(New, { foreignKey: 'categoryId' });
New.belongsTo(Category, { foreignKey: 'categoryId' });

// Relasi User - Comments
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

// Relasi News - Comments
New.hasMany(Comment, { foreignKey: 'newsId' });
Comment.belongsTo(New, { foreignKey: 'newsId' });

// Relasi
User.hasMany(Like, { foreignKey: "userId" });
Like.belongsTo(User, { foreignKey: "userId" });

New.hasMany(Like, { foreignKey: "newsId" });
Like.belongsTo(New, { foreignKey: "newsId" });   

export { User, New, Category, Comment, Like };
