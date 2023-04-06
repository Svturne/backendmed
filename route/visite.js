const express = require("express");
const upload = require("../config/imageUpload");
const {
  addVisite,
  getVisiteList,
  uploadPicture,
} = require("../controller/visite");
const router = express.Router();

router.route("/visite").post(addVisite);
router.route("/visite/:id").get(getVisiteList);
router
  .route("/visite/:id/picture")
  .patch(upload.single("picture"), uploadPicture);

module.exports = router;
