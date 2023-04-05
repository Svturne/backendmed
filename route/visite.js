const express = require("express");
const { addVisite } = require("../controller/visite");
const router = express.Router();

router.route("/visite").post(addVisite);

module.exports = router;
