const DestinationCategory = require("../models/destinationCategory.js");

// Create a new category
exports.createDestinationCategory = async (req, res) => {
  try {
    const newCategory = await DestinationCategory.create(req.body);
    res.status(201).json({ message: "Destination Category created successfully", data: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error: error.message });
  }
};

// Get all categories
exports.getAllDestinationCategories = async (req, res) => {
  try {
    const categories = await DestinationCategory.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error: error.message });
  }
};

// Get single category by ID
exports.getDestinationCategoryById = async (req, res) => {
  try {
    const category = await DestinationCategory.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category", error: error.message });
  }
};

// Update category
exports.updateDestinationCategory = async (req, res) => {
  try {
    const [updatedRows] = await DestinationCategory.update(req.body, { where: { id: req.params.id } });
    if (updatedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    const updatedCategory = await DestinationCategory.findByPk(req.params.id);
    res.status(200).json({ message: "Category updated successfully", data: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error: error.message });
  }
};

// Delete category
exports.deleteDestinationCategory = async (req, res) => {
  try {
    const deletedRows = await DestinationCategory.destroy({ where: { id: req.params.id } });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error: error.message });
  }
};
