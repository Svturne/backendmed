const express = require("express");
const { addMaladie } = require("../controller/maladie");
const router = express.Router();

router.route("/maladie").post(addMaladie);

module.exports = router;
