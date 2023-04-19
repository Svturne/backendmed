const express = require("express");
const {
  logout,
  getProfilePatient,
  refreshPatient,
  getMaladies,
  getVisite,
} = require("../controller/patientOperation");
const {
  patientFirstAuth,
  patientAuth,
  patientVerifaction,
} = require("../middleware/patientUser");
const router = express.Router();

router.route("/patient/user/refresh").post(patientFirstAuth, refreshPatient);
router.route("/patient/user/logout").post(logout);
router
  .route("/patient/user")
  .get(patientAuth, patientVerifaction, getProfilePatient);

router
  .route("/patient/user/allmaladie")
  .get(patientAuth, patientVerifaction, getMaladies);
router
  .route("/patient/user/allvisite/:id")
  .get(patientAuth, patientVerifaction, getVisite);

module.exports = router;
