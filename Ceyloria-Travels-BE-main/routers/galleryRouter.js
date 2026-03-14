const express = require("express");
const {
  createGalleryItem,
  getGallery,
  deleteGalleryItem,
} = require("../controllers/galleryController.js");

const galleryRouter = express.Router();

galleryRouter.post("/", createGalleryItem);   // admin only
galleryRouter.get("/", getGallery);
galleryRouter.delete("/:id", deleteGalleryItem); // admin only

module.exports = galleryRouter;
