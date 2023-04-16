const express = require("express");
const {
  addMaladie,
  getAllMaladie,
  updateMaladie,
} = require("../controller/maladie");
const { auth } = require("../middleware/medecin");
const router = express.Router();

router.route("/maladie").post(auth, addMaladie);
router.route("/maladie").get(auth, getAllMaladie);
router.route("/maladie/:id").put(auth, updateMaladie);

module.exports = router;
