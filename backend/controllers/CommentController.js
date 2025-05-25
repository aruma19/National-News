import Comment from "../models/CommentModel.js";
import New from "../models/NewModel.js";
import User from "../models/UserModel.js";
import Admin from "../models/AdminModel.js";

// Get all comments by logged-in user or admin
export const getComments = async (req, res) => {
  try {
    const whereClause = req.role === "admin" 
      ? { adminId: req.adminId } 
      : { userId: req.userId };

    const comments = await Comment.findAll({
      where: whereClause,
      include: [
        { model: New, attributes: ["title"] },
        { model: User, attributes: ["username"] },
        { model: Admin, attributes: ["username"] }
      ]
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single comment by ID for the logged-in user/admin
export const getCommentById = async (req, res) => {
  try {
    const whereClause = req.role === "admin"
      ? { id: req.params.id, adminId: req.adminId }
      : { id: req.params.id, userId: req.userId };

    const comment = await Comment.findOne({
      where: whereClause,
      include: [{ model: New, attributes: ["title"] }]
    });

    if (!comment) return res.status(404).json({ message: "Komentar tidak ditemukan" });

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all comments for a specific news, by any user or admin
export const getCommentsByNews = async (req, res) => {
  try {
    const { newsId } = req.params;

    const comments = await Comment.findAll({
      where: { newsId },
      include: [
        { model: User, attributes: ["username"] },
        { model: Admin, attributes: ["username"] }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new comment, by user or admin
export const createComment = async (req, res) => {
  try {
    const { newsId, content } = req.body;

    const news = await New.findByPk(newsId);
    if (!news) return res.status(404).json({ message: "Berita tidak ditemukan" });

    const commentData = {
      newsId,
      content
    };

    if (req.role === "admin") {
      commentData.adminId = req.adminId;
    } else {
      commentData.userId = req.userId;
    }

    await Comment.create(commentData);

    res.status(201).json({ message: "Komentar berhasil dibuat" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update comment by owner (user or admin)
export const updateComment = async (req, res) => {
  try {
    const whereClause = req.role === "admin"
      ? { id: req.params.id, adminId: req.adminId }
      : { id: req.params.id, userId: req.userId };

    const comment = await Comment.findOne({ where: whereClause });
    if (!comment) return res.status(404).json({ message: "Komentar tidak ditemukan" });

    await comment.update({ content: req.body.content });
    res.json({ message: "Komentar diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete comment by owner (user/admin) or full admin privilege
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: "Komentar tidak ditemukan" });

    const isOwner = req.role !== "admin" && comment.userId === req.userId;

    if (req.role === "admin" || isOwner ) {
      await comment.destroy();
      res.json({ message: "Komentar dihapus" });
    } else {
      res.status(403).json({ message: "Akses ditolak" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
