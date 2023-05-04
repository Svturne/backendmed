const Maladie = require("../model/Maladie");
const client = require("../bd/connect");
const { ObjectId } = require("mongodb");

const addMaladie = async (req, res) => {
  try {
    let maladie = new Maladie({
      patientId: req.body.patientId,
      createdAt: new Date(),
      maladie: req.body.maladie,
    });

    let result = await client.bd().collection("maladies").insertOne(maladie);

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

const updateMaladie = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const newMaladie = req.body.maladie;
    let result = await client
      .bd()
      .collection("maladies")
      .updateOne({ _id: id }, { $set: { maladie: newMaladie } });
    res.status(200).json(result);
  } catch (error) {
    console.log("erreur in update maladie");
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { addMaladie, getAllMaladie, updateMaladie };
