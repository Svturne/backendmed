const mongoose = require("mongoose");

const tokensSchema = new mongoose.Schema({
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
    expires: 180,
  },
});

const Tokens = mongoose.model("Tokens", tokensSchema);

module.exports = Tokens;
