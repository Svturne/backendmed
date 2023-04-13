const mongoose = require("mongoose");

const tokensPatientSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },

  patientId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },

  createdAt: {
    type: Date,
    default: new Date(),
    expires: 365 * 24 * 60 * 60,
  },
});

const TokensPatient = mongoose.model("TokensPatient", tokensPatientSchema);

module.exports = TokensPatient;
