const express = require("express");
const upload = require("../config/imageUpload");
const {
  addVisite,
  getVisiteList,
  uploadPicture,
} = require("../controller/visite");
const { auth } = require("../middleware/medecin");
const router = express.Router();

router.route("/visite").post(auth, addVisite);
router.route("/visite/:id").get(auth, getVisiteList);
router
  .route("/visite/:id/picture")
  .patch(auth, upload.single("picture"), uploadPicture);

module.exports = router;
