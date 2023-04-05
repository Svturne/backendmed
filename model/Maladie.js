const mongoose = require("mongoose");

const maladieSchema = new mongoose.Schema({
  maladie: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  patientId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
});

const Maladie = mongoose.model("Maladie", maladieSchema);

module.exports = Maladie;
