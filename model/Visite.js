const mongoose = require("mongoose");

const visiteSchema = new mongoose.Schema({
  remarque: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  pictures: {
    type: [{ picture: String, date: Date }], // TODO: url type
  },
  maladieId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
});

const Visite = mongoose.model("Visite", visiteSchema);

module.exports = Visite;
