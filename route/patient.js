const express = require("express");
const {
  addPatient,
  deletePatient,
  editPatient,
  getAllPatient,
} = require("../controller/patient");
const router = express.Router();

router.route("/patient").post(addPatient);
router.route("/patient/:id").delete(deletePatient);
router.route("/patient/:id").put(editPatient);
router.route("/patient/:medecinId").get(getAllPatient);
module.exports = router;
