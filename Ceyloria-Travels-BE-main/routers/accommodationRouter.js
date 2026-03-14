const express = require("express");
const {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,  
  deleteAccommodation,
} = require("../controllers/accommodationController.js");

const router = express.Router();

router.post("/", createAccommodation);
router.get("/", getAccommodations);
router.get("/:id", getAccommodationById);
router.put("/:id", updateAccommodation);
router.delete("/:id", deleteAccommodation);

module.exports = router;
