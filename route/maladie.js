const express = require("express");
const { addMaladie, getAllMaladie } = require("../controller/maladie");
const router = express.Router();

router.route("/maladie").post(addMaladie);
router.route("/maladie").get(getAllMaladie);

module.exports = router;
