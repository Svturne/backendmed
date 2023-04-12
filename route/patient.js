const express = require("express");
const {
  addPatient,
  deletePatient,
  editPatient,
  getAllPatient,
} = require("../controller/patient");
const { auth } = require("../middleware/medecin");
const { isMedecinperm } = require("../middleware/patient");
const router = express.Router();

router.route("/patient").post(auth, addPatient);
router.route("/patient/:id").delete(auth, isMedecinperm, deletePatient);
router.route("/patient/:id").put(editPatient);
router.route("/patient/:medecinId").get(getAllPatient);
module.exports = router;
