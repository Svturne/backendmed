const express = require("express");
const upload = require("../config/imageUpload");
const {
  addVisite,
  getVisiteList,
  uploadPicture,
} = require("../controller/visite");
const { auth } = require("../middleware/medecin");
const { isMedecinperm } = require("../middleware/patient");
const router = express.Router();

router.route("/visite").post(auth, isMedecinperm, addVisite);
router.route("/visite/:id").get(auth, getVisiteList);
router
  .route("/visite/:id/picture")
  .patch(auth, upload.single("picture"), isMedecinperm, uploadPicture);

module.exports = router;
