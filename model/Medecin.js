const mongoose = require("mongoose");

const medecinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
  },
  codeResetPassword: {
    type: Number,
    default: null,
    required: true,
  },
});

const Medecin = mongoose.model("Medecin", medecinSchema);

module.exports = Medecin;
