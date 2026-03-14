// controllers/travelPackageController.js

const TravelPackage = require("../models/travelPackage.js");
const { Op } = require('sequelize');

// helper: admin guard
function ensureAdmin(req, res) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Forbidden: Admins only" });
    return false;
  }
  return true;
}

//  CREATE PACKAGE (ADMIN ONLY) 
exports.createPackage = function(req, res) {
  if (!ensureAdmin(req, res)) return;
  console.log("Create Package Body:", JSON.stringify(req.body, null, 2));

  TravelPackage.create(req.body)
    .then(() => {
      res.json({ message: "Travel Package Created Successfully" });
    })
    .catch((error) => {
      console.error("Create Package Error:", error);
      res.status(500).json({
        message: "Failed to create travel package",
        error: error.message,
      });
    });
}

//  GET ALL PACKAGES 
exports.getAllPackages = function(req, res) {
  TravelPackage.findAll()
    .then((packages) => {
      res.json(packages);
    })
    .catch((error) => {
      console.error("Get All Packages Error:", error);
      res.status(500).json({
        message: "Failed to fetch travel packages",
        error: error.message,
      });
    });
}

//  GET SINGLE PACKAGE
exports.getPackage = function(req, res) {
  const id = req.params.id;

  TravelPackage.findByPk(id)
    .then((pkg) => {
      if (!pkg) {
        return res.status(404).json({ message: "Package Not Found" });
      }
      res.json(pkg);
    })
    .catch((error) => {
      console.error("Get Package Error:", error);
      res.status(500).json({
        message: "Failed to fetch package",
        error: error.message,
      });
    });
}

//  UPDATE PACKAGE (ADMIN ONLY)
exports.updatePackage = function(req, res) {
  if (!ensureAdmin(req, res)) return;

  const id = req.params.id;

  TravelPackage.update(req.body, { where: { id: id } })
    .then((updatedRows) => {
      if (updatedRows[0] === 0) {
        return res.status(404).json({ message: "Package Not Found" });
      } 
      return TravelPackage.findByPk(id).then(updated => {
        res.json({
          message: "Package Updated Successfully",
          package: updated,
        });
      });
    })
    .catch((error) => {
      console.error("Update Package Error:", error);
      res.status(500).json({
        message: "Failed to update package",
        error: error.message,
      });
    });
}

//  DELETE PACKAGE (ADMIN ONLY)
exports.deletePackage = function(req, res) {
  if (!ensureAdmin(req, res)) return;

  const id = req.params.id;

  TravelPackage.destroy({ where: { id: id } })
    .then((deletedRows) => {
      if (deletedRows === 0) {
        return res.status(404).json({ message: "Package Not Found" });
      }
      res.json({ message: "Package Deleted Successfully" });
    })
    .catch((error) => {
      console.error("Delete Package Error:", error);
      res.status(500).json({
        message: "Failed to delete package",
        error: error.message,
      });
    });
}

// GET CURATED PACKAGES
exports.getCuratedPackages = function(req, res) {
  TravelPackage.findAll({ where: { isCurated: true } })
    .then((packages) => {
      res.json(packages);
    })
    .catch((error) => {
      console.error("Get Curated Packages Error:", error);
      res.status(500).json({
        message: "Failed to fetch curated packages",
        error: error.message,
      });
    });
}

// UPDATE CURATED PACKAGES (Set which packages are curated)
exports.updateCuratedPackages = async function(req, res) {
  if (!ensureAdmin(req, res)) return;

  const { packageIds } = req.body; // Expecting an array of exactly 3 IDs

  if (!Array.isArray(packageIds) || packageIds.length > 3) {
    return res.status(400).json({ message: "Please provide up to 3 package IDs" });
  }

  try {
    // Reset all curated flags
    await TravelPackage.update({ isCurated: false }, { where: {} });

    // Set curated flags for selected IDs
    await TravelPackage.update(
      { isCurated: true },
      { where: { id: { [Op.in]: packageIds } } }
    );

    res.json({ message: "Curated packages updated successfully" });
  } catch (error) {
    console.error("Update Curated Packages Error:", error);
    res.status(500).json({
      message: "Failed to update curated packages",
      error: error.message,
    });
  }
}
