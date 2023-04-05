const Maladie = require("../model/Maladie");
const client = require("../bd/connect");

const addMaladie = async (req, res) => {
  try {
    let maladie = new Maladie({
      patientId: req.body.patientId,
      createdAt: new Date(),
      maladie: req.body.maladie,
    });

    let result = await client.bd().collection("maladies").insertOne(maladie);
    console.log("maladie added");
    res.status(200).json(result);
  } catch (error) {
    console.log("erreur in add maladie");
    console.log(error);
    res.status(500).json(error);
  }
};

const getAllMaladie = async (req, res) => {
  try {
    const allMaladies = client.bd().collection("maladies").find();
    const result = await allMaladies.toArray();
    res.status(200).json(result);
  } catch (error) {
    console.log("erreur in get all maladie");
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { addMaladie, getAllMaladie };
