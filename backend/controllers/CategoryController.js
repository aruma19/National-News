import Category from "../models/CategoryModel.js";

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const response = await Category.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const response = await Category.findOne({
      where: { id: req.params.id }
    });
    if (!response) return res.status(404).json({ message: "Kategori tidak ditemukan" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    await Category.create(req.body);
    res.status(201).json({ message: "Kategori berhasil dibuat" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Kategori tidak ditemukan" });

    await category.update(req.body);
    res.json({ message: "Kategori diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    await Category.destroy({ where: { id: req.params.id } });
    res.json({ message: "Kategori dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
