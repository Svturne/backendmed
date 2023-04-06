const express = require("express");
const upload = require("../config/imageUpload");
const {
  addMedecin,
  getProfileMedecin,
  uploadPicture,
} = require("../controller/medecin");
const router = express.Router();

router.route("/medecin").post(addMedecin);
router.route("/medecin/:id").get(getProfileMedecin);
router
  .route("/medecin/:id/picture")
  .patch(upload.single("picture"), uploadPicture);

module.exports = router;
