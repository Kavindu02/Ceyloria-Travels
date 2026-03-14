const express = require("express");
const {
  createDestinationCategory,
  getAllDestinationCategories,
  getDestinationCategoryById,
  updateDestinationCategory,
  deleteDestinationCategory,
} = require("../controllers/destinationController.js");

const destinationRouter = express.Router();

destinationRouter.post("/", createDestinationCategory);
destinationRouter.get("/", getAllDestinationCategories);
destinationRouter.get("/:id", getDestinationCategoryById);
destinationRouter.put("/:id", updateDestinationCategory);
destinationRouter.delete("/:id", deleteDestinationCategory);

module.exports = destinationRouter;
