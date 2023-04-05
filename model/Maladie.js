const mongoose = require("mongoose");

const maladieSchema = new mongoose.Schema({
  maladie: {
    type: String,
    required: true,
    unique: true,
  },
  patientId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
});

const Maladie = mongoose.model("Maladie", maladieSchema);

module.exports = Maladie;
