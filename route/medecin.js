const express = require("express");
const { addMedecin } = require("../controller/medecin");
const router = express.Router();

router.route("/medecin").post(addMedecin);

module.exports = router;
