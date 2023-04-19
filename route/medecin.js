const express = require("express");
const upload = require("../config/imageUpload");
const {
  addMedecin,
  getProfileMedecin,
  uploadPicture,
  loginMedecin,

  logout,
  refreshToken,
  changePassword,
  sendCodePassword,
  checkCode,
  resetPassword,
} = require("../controller/medecin");
const { auth, checkEmail } = require("../middleware/medecin");
const router = express.Router();

router.route("/medecin").post(addMedecin);
router.route("/medecin").get(auth, getProfileMedecin);
router.route("/medecin/login").post(loginMedecin);
router.route("/medecin/refreshtoken").post(refreshToken);
router.route("/medecin/newpassword").post(auth, changePassword);
router.route("/medecin/logout").post(logout);

router.route("/medecin/sendcode").post(sendCodePassword);
router.route("/medecin/verifycode").post(checkCode);
router.route("/medecin/resetpassword").post(resetPassword);

router
  .route("/medecin/picture")
  .patch(auth, upload.single("picture"), uploadPicture);

module.exports = router;
