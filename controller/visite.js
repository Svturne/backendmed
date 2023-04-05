const Visite = require("../model/Visite");
const client = require("../bd/connect");
const { ObjectId } = require("mongodb");

const addVisite = async (req, res) => {
  try {
    let visite = new Visite({
      maladieId: req.body.maladieId,
      remarque: req.body.remarque,
      pictures: req.body.pictures,
    });

    let result = await client.bd().collection("visites").insertOne(visite);
    console.log("Visite added");
    res.status(200).json(result);
  } catch (error) {
    console.log("erreur in add Visite");
    console.log(error);
    res.status(500).json(error);
  }
};

const getVisiteList = async (req, res) => {
  try {
    const id = ObjectId(req.params.id);
    let result = client.bd().collection("visites").find({ maladieId: id });
    const visiteListe = await result.toArray();
    res.status(200).json(visiteListe);
  } catch (error) {
    console.log("erreur in get visite liste");
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { addVisite, getVisiteList };
