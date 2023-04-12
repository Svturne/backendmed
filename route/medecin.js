const express = require("express");
const upload = require("../config/imageUpload");
const {
  addMedecin,
  getProfileMedecin,
  uploadPicture,
  loginMedecin,
  auth,
  logout,
} = require("../controller/medecin");
const router = express.Router();

router.route("/medecin").post(addMedecin);
router.route("/medecin/:id").get(getProfileMedecin);
router.route("/medecin/login").post(loginMedecin);
router.route("/medecin/auth").post(auth, (req, res) => {
  res.send("Le Token a été authentifié");
});
router.route("/medecin/logout").post(logout);

router
  .route("/medecin/:id/picture")
  .patch(upload.single("picture"), uploadPicture);

module.exports = router;
