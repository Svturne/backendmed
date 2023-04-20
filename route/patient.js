const express = require("express");
const {
  addPatient,
  deletePatient,
  editPatient,
  getAllPatient,
  reSendQr,
} = require("../controller/patient");
const { auth } = require("../middleware/medecin");
const { isMedecinperm } = require("../middleware/patient");
const router = express.Router();

router.route("/patient").post(auth, addPatient);
router.route("/patient/:id").delete(auth, isMedecinperm, deletePatient);
router.route("/patient/:id").put(auth, isMedecinperm, editPatient);
router.route("/patient/:medecinId").get(getAllPatient);
router.route("/patient/resendqr/:id").post(auth, isMedecinperm, reSendQr);
module.exports = router;
