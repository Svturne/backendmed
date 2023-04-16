const express = require("express");
const {
  logout,
  getProfilePatient,
  refreshPatient,
} = require("../controller/patientOperation");
const { patientFirstAuth, patientAuth } = require("../middleware/patientUser");
const router = express.Router();

router.route("/patient/refresh").post(patientFirstAuth, refreshPatient);
router.route("/patient/logout").post(logout);
router.route("/patient").get(patientAuth, getProfilePatient);
module.exports = router;
