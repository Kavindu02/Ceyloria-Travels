const Gallery = require("../models/galleryModel.js");

// Create new gallery image (Admin Only)
exports.createGalleryItem = async function(req, res) {
  try {
    // admin guard
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const { title, imageUrl } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ message: "Title and Image are required" });
    }

    const galleryItem = await Gallery.create({
      title,
      imageUrl,
      createdBy: req.user.userId,
    });

    res.json({ message: "Image added to gallery", data: galleryItem });
  } catch (err) {
    res.status(500).json({ message: "Failed to create gallery item", error: err.message });
  }
}

// get all gallery images
exports.getGallery = async function(req, res) {
  try {
    const items = await Gallery.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to load gallery", error: err.message });
  }
}

// delete gallery image (Admin Only)
exports.deleteGalleryItem = async function(req, res) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const id = req.params.id;

    const deletedRows = await Gallery.destroy({ where: { id: id } });

    if (deletedRows === 0) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    res.json({ message: "Gallery item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
}
