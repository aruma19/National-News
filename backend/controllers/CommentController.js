import Comment from "../models/CommentModel.js";
import New from "../models/NewModel.js";
import User from "../models/UserModel.js";

// Get all cooments by user
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { userId: req.userId },
      include: [{ model: New, attributes: ['content'] }]
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comment by ID
export const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      include: [{ model: New, attributes: ['content'] }]
    });

    if (!comment) return res.status(404).json({ message: "Komentar tidak ditemukan" });

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new comment
export const createComment = async (req, res) => {
  try {
    const { newsId, content } = req.body;

    // Pastikan berita yang dituju ada
    const news = await New.findByPk(newsId);
    if (!news) return res.status(404).json({ message: "Berita tidak ditemukan" });

    await Comment.create({
      newsId,
      content,
      userId: req.userId
    });

    res.status(201).json({ message: "Komentar berhasil dibuat" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update comment
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!comment) return res.status(404).json({ message: "Komentar tidak ditemukan" });

    await comment.update({ content: req.body.content });
    res.json({ message: "Komentar diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    // Cari komentar berdasarkan id saja dulu, tanpa filter userId
    const comment = await Comment.findOne({
      where: { id: req.params.id }
    });

    if (!comment) return res.status(404).json({ message: "Komentar tidak ditemukan" });

    // Cek apakah yang request adalah admin atau pemilik komentar
    if (req.role === "admin" || comment.userId === req.userId) {
      await comment.destroy();
      res.json({ message: "Komentar dihapus" });
    } else {
      res.status(403).json({ message: "Akses ditolak" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

