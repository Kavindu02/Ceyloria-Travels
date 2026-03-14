const express = require("express");
const { sendContactMail, sendPlanTripMail } = require("../controllers/contactController.js");

const router = express.Router();

router.post("/contact", sendContactMail);
router.post("/plan-trip", sendPlanTripMail);

module.exports = router;
