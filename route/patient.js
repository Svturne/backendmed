const express = require("express");
const {
  addPatient,
  deletePatient,
  editPatient,
} = require("../controller/patient");
const router = express.Router();

router.route("/patient").post(addPatient);
router.route("/patient/:id").delete(deletePatient);
router.route("/patient/:id").put(editPatient);
module.exports = router;
