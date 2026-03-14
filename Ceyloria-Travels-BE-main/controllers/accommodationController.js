// controllers/accommodationController.js

const Accommodation = require("../models/accommodation.js");

// helper: admin guard
function ensureAdmin(req, res) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Forbidden: Admins only" });
    return false;
  }
  return true;
}

// =============================================
//  CREATE ACCOMMODATION  (ADMIN ONLY)
// =============================================
exports.createAccommodation = function(req, res) {
  if (!ensureAdmin(req, res)) return;

  console.log("Creating accommodation with body:", req.body); // Debug log

  Accommodation.create(req.body)
    .then((accommodation) => {
      res.json({
        message: "Accommodation added successfully",
        accommodation,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Failed to add accommodation",
        error: error.message,
      });
    });
}

// =============================================
//  GET ALL ACCOMMODATIONS (PUBLIC)
// =============================================
exports.getAccommodations = function(req, res) {
  Accommodation.findAll()
    .then((accommodations) => {
      res.json(accommodations);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Failed to fetch accommodations",
        error: error.message,
      });
    });
}

// =============================================
//  GET SINGLE ACCOMMODATION (PUBLIC)
// =============================================
exports.getAccommodationById = function(req, res) {
  const id = req.params.id;

  Accommodation.findByPk(id)
    .then((accommodation) => {
      if (!accommodation) {
        return res.status(404).json({ message: "Accommodation not found" });
      }
      res.json(accommodation);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Failed to fetch accommodation",
        error: error.message,
      });
    });
}

// =============================================
//  UPDATE ACCOMMODATION (ADMIN ONLY)
// =============================================
exports.updateAccommodation = function(req, res) {
  if (!ensureAdmin(req, res)) return;

  const id = req.params.id;

  Accommodation.update(req.body, { where: { id: id } })
    .then((updatedRows) => {
      if (updatedRows[0] === 0) {
        return res.status(404).json({ message: "Accommodation not found" });
      }
      return Accommodation.findByPk(id).then((updated) => {
        res.json({
          message: "Accommodation updated successfully",
          accommodation: updated,
        });
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Failed to update accommodation",
        error: error.message,
      });
    });
}

// =============================================
//  DELETE ACCOMMODATION (ADMIN ONLY)
// =============================================
exports.deleteAccommodation = function(req, res) {
  if (!ensureAdmin(req, res)) return;

  const id = req.params.id;

  Accommodation.destroy({ where: { id: id } })
    .then((deletedRows) => {
      if (deletedRows === 0) {
        return res.status(404).json({ message: "Accommodation not found" });
      }
      res.json({ message: "Accommodation deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Failed to delete accommodation",
        error: error.message,
      });
    });
}
