const express = require("express");
const {
	sendContactMail,
	sendPlanTripMail,
	sendAccommodationBookingMail,
	sendPackageBookingMail,
} = require("../controllers/contactController.js");

const router = express.Router();

router.post("/contact", sendContactMail);
router.post("/plan-trip", sendPlanTripMail);
router.post("/accommodation-booking", sendAccommodationBookingMail);
router.post("/package-booking", sendPackageBookingMail);

module.exports = router;
