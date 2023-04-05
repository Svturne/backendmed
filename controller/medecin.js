const Medecin = require("../model/Medecin");
const client = require("../bd/connect");

const addMedecin = async (req, res) => {
  try {
    let medecin = new Medecin({
      name: req.body.name,
      email: req.body.email,
    });

    let result = await client.bd().collection("medecins").insertOne(medecin);
    console.log("medecin added");
    res.status(200).json(result);
  } catch (error) {
    console.log("erreur in add medecin");
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { addMedecin };
