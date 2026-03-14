
const express = require("express");

const {
  createPackage,
  getAllPackages,
  getPackage,
  updatePackage,
  deletePackage,
  getCuratedPackages,
  updateCuratedPackages,
} = require("../controllers/travelPackageController.js");

const packageRouter = express.Router();

packageRouter.post("/", createPackage);
packageRouter.get("/", getAllPackages);
packageRouter.get("/curated", getCuratedPackages);
packageRouter.get("/:id", getPackage);
packageRouter.put("/curated", updateCuratedPackages);
packageRouter.put("/:id", updatePackage);
packageRouter.delete("/:id", deletePackage);

module.exports = packageRouter;
