const express = require("express");
const {
  addMaladie,
  getAllMaladie,
  updateMaladie,
} = require("../controller/maladie");
const router = express.Router();

router.route("/maladie").post(addMaladie);
router.route("/maladie").get(getAllMaladie);
router.route("/maladie/:id").put(updateMaladie);

module.exports = router;
