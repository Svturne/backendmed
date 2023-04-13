const express = require("express");
const { patientFirstAuth } = require("../middleware/patientUser");
const router = express.Router();

router.route("/patient/firstauth").post(patientFirstAuth);

module.exports = router;
