const express = require("express");
const {
  addMaladie,
  getAllMaladie,
  updateMaladie,
} = require("../controller/maladie");
const { auth } = require("../middleware/medecin");
const { isMedecinperm } = require("../middleware/patient");
const router = express.Router();

router.route("/maladie").post(auth, addMaladie);
router.route("/maladie").get(auth, isMedecinperm, getAllMaladie);
router.route("/maladie/:id").put(auth, isMedecinperm, updateMaladie);

module.exports = router;
