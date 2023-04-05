const mongoose = require("mongoose");

const visiteSchema = new mongoose.Schema({
  remarque: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  pictures: {
    type: [String], // TODO: url type
    required: true,
  },
  maladieId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
});

const Visite = mongoose.model("Visite", visiteSchema);

module.exports = Visite;
