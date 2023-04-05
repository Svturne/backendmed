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
  profilePicture: {
    type: String,
    required: true,
  },
});

const Medecin = mongoose.model("Medecin", medecinSchema);

module.exports = Medecin;
