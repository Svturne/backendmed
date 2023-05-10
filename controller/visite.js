const Visite = require("../model/Visite");
const client = require("../bd/connect");
const { ObjectId } = require("mongodb");
const ip = require("ip");

const addVisite = async (req, res) => {
  try {
    let visite = new Visite({
      maladieId: req.body.maladieId,
      remarque: req.body.remarque,
      desc: req.body.desc,
      pictures: req.body.pictures,
    });

    let result = await client.bd().collection("visites").insertOne(visite);

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

const getVisitePicture = async (req, res) => {
  try {
    const id = ObjectId(req.params.id);
    let result = client.bd().collection("visites").find({ _id: id });
    const visitePicture = await result.toArray();
    res.status(200).json(visitePicture);
  } catch (error) {
    console.log("erreur in get visite pictureq");
    console.log(error);
    res.status(500).json(error);
  }
};

const uploadPicture = async (req, res) => {
  try {
    const id = ObjectId(req.params.id);
    const adresseIp = ip.address();
    await client
      .bd()
      .collection("visites")
      .findOneAndUpdate(
        { _id: id },
        {
          $push: {
            pictures: {
              uri:
                "http://" +
                adresseIp +
                ":" +
                process.env.PORT +
                "/" +
                req.file.path,
              description: req.body.description,
              date: new Date(),
            },
          },
        },
        { new: true }
      );

    res.status(200).json({ message: " Visite image uploaded successfully" });
  } catch (error) {
    console.log("Visite erreur in upload profile picture medecin");
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { addVisite, getVisiteList, uploadPicture, getVisitePicture };
