const Visite = require("../model/Visite");
const client = require("../bd/connect");

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

module.exports = { addVisite };
