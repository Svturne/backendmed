const Medecin = require("../model/Medecin");
const client = require("../bd/connect");
const { ObjectId } = require("mongodb");

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

const getProfileMedecin = async (req, res) => {
  try {
    const id = ObjectId(req.params.id); // TODO: get id from token
    let result = await client.bd().collection("medecins").findOne({ _id: id });
    res.status(200).json(result);
  } catch (error) {
    console.log("erreur in get profile medecin");
    console.log(error);
    res.status(500).json(error);
  }
};

const uploadPicture = async (req, res) => {
  try {
    const id = ObjectId(req.params.id);
    let result = await client
      .bd()
      .collection("medecins")
      .findOneAndUpdate(
        { _id: id },
        { $set: { profilePicture: req.file.path } },
        { new: true }
      );
    res.status(200).json(result);
  } catch (error) {
    console.log("erreur in upload profile picture medecin");
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { addMedecin, getProfileMedecin, uploadPicture };
