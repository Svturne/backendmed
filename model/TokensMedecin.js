const mongoose = require("mongoose");

const tokensMedecinSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },

  medecinId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
    expires: 7 * 24 * 60 * 60,
  },
});

const TokensMedecin = mongoose.model("TokensMedecin", tokensMedecinSchema);

module.exports = TokensMedecin;
