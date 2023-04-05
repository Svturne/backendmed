const express = require("express");
const { addMedecin, getProfileMedecin } = require("../controller/medecin");
const router = express.Router();

router.route("/medecin").post(addMedecin);
router.route("/medecin/:id").get(getProfileMedecin);

module.exports = router;
