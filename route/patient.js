const express = require("express");
const { addPatient } = require("../controller/patient");
const router = express.Router();

router.route("/patient").post(addPatient);

module.exports = router;
