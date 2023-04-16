const express = require("express");
const {
  firstCo,
  logout,
  getProfilePatient,
  refreshPatient,
} = require("../controller/patientOperation");
const { patientFirstAuth } = require("../middleware/patientUser");
const router = express.Router();

router.route("/patient/refresh").post(patientFirstAuth, refreshPatient);
router.route("/patient/logout").post(logout);
router.route("/patient").get(patientFirstAuth, getProfilePatient);
module.exports = router;
