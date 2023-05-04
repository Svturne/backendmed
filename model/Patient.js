const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    min: 0,
    max: 100, //TODO: check if min / max works properly
    required: true,
  },
  sexe: {
    type: String,
    required: true,
  },
  idMedecin: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
