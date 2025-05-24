import New from "../models/NewModel.js";
import Category from "../models/CategoryModel.js";

// Get all news for the logged-in user, include category data
async function getNews(req, res) {
  try {
    const response = await New.findAll({
      include: [{ model: Category, attributes: ["category"] }] 
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
}

// Get news by ID including category
async function getNewById(req, res) {
  try {
    const response = await New.findOne({
      where: { id: req.params.id },
      include: [{
        model: Category,
        attributes: ['id', 'category']
      }]
    });
    if (!response) return res.status(404).json({ message: "News not found" });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
}

// Create news, pastikan categoryId dikirim dari client
async function createNew(req, res) {
  try {
    const userId = req.userId;
    const {
      author,
      title,
      url,
      description,
      iso_date,
      image_small,
      image_large,
      categoryId  // <-- pastikan ini ada di req.body
    } = req.body;

    // Validasi categoryId misal (optional)
    if (!categoryId) {
      return res.status(400).json({ msg: "Category is required" });
    }

    await New.create({
      author,
      title,
      url,
      description,
      iso_date,
      image_small,
      image_large,
      userId,
      categoryId,
    });

    res.status(201).json({ msg: "News Created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Failed to create news", detail: error.message });
  }
}

// Update news juga sama, gunakan categoryId dari req.body
async function updateNew(req, res) {
  try {
    const newItem = await New.findByPk(req.params.id);
    if (!newItem) {
      return res.status(404).json({ message: "News not found" });
    }

    // Hak akses (jika diperlukan)
    if (req.role !== "admin" && newItem.userId !== req.userId) {
      return res.status(403).json({ message: "Forbidden: You cannot update this news" });
    }

    // Filter fields yang boleh diupdate
    const { author, title, url, description, iso_date, image_small, image_large, categoryId } = req.body;

    // Optional: validasi field minimal
    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required" });
    }

    await newItem.update({ author, title, url, description, iso_date, image_small, image_large, categoryId });
    res.json(newItem);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


// Delete news
async function deleteNew(req, res) {
  try {
    await New.destroy({ where: { id: req.params.id } });
    res.status(201).json({ msg: "News Deleted" });
  } catch (error) {
    console.log(error.message);
  }
}

export { getNews, getNewById, createNew, updateNew, deleteNew };
