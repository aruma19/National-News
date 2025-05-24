import Like from "../models/LikeModel.js";
import New from "../models/NewModel.js";
import Category from "../models/CategoryModel.js";

// Tambah like
export const likeNews = async (req, res) => {
  try {
    const { newsId } = req.body;
    const userId = req.userId;

    // Cek apakah user sudah like
    const existingLike = await Like.findOne({
      where: { userId, newsId }
    });
    if (existingLike) return res.status(409).json({ message: "Sudah disukai" });

    await Like.create({ userId, newsId });
    res.status(201).json({ message: "Berita disukai" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil daftar berita yang disukai oleh user
export const getLikedNews = async (req, res) => {
  try {
    const userId = req.userId;
    const likedNews = await Like.findAll({
      where: { userId },
      include: [{
        model: New,
         required: true, // hanya ambil yang news-nya masih ada
        attributes: ["id", "title", "content", "author", "image_small", "iso_date"],
        include: [{ 
          model: Category,
          attributes: ["category"]
        }]
      }]

    });

    // Kembalikan hanya data berita yang disukai
    res.status(200).json(likedNews.map(item => item.new));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cek apakah user sudah like berita tertentu
export const checkLikeStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const newsId = req.params.id;

    const like = await Like.findOne({
      where: { userId, newsId }
    });

    res.status(200).json({ liked: !!like }); // true jika like ditemukan, false jika tidak
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Hapus like (unlike)
export const unLikedNews = async (req, res) => {
  try {
    const userId = req.userId;
    const newsId = req.params.id;

    const like = await Like.findOne({ where: { userId, newsId } });
    if (!like) return res.status(404).json({ message: "Like tidak ditemukan" });

    await Like.destroy({ where: { userId, newsId } });
    res.status(200).json({ message: "Berita di-unlike" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLikeCount = async (req, res) => {
  try {
    const newsId = req.params.id;
    const count = await Like.count({ where: { newsId } });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
