const mongoose = require("mongoose");

let tokensMedecinSchema = new mongoose.Schema({
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
    default: new Date(),
  },
});
tokensMedecinSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 }); //30days * 24hours * 60 minutes * 60 seconds

let TokensMedecin = mongoose.model("TokensMedecin", tokensMedecinSchema);

module.exports = TokensMedecin;
