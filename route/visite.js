const express = require("express");
const { addVisite, getVisiteList } = require("../controller/visite");
const router = express.Router();

router.route("/visite").post(addVisite);
router.route("/visite/:id").get(getVisiteList);

module.exports = router;
