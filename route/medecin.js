const express = require("express");
const upload = require("../config/imageUpload");
const {
  addMedecin,
  getProfileMedecin,
  uploadPicture,
  loginMedecin,

  logout,
  refreshToken,
} = require("../controller/medecin");
const { auth } = require("../middleware/medecin");
const router = express.Router();

router.route("/medecin").post(addMedecin);
router.route("/medecin").get(auth, getProfileMedecin);
router.route("/medecin/login").post(loginMedecin);
router.route("/medecin/auth").post(auth, (req, res) => {
  res.send("Le Token a été authentifié");
});

router.route("/medecin/refreshtoken").post(refreshToken);

router.route("/medecin/logout").post(logout);

router
  .route("/medecin/picture")
  .patch(auth, upload.single("picture"), uploadPicture);

module.exports = router;
