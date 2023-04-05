const Patient = require("../model/Patient");
const client = require("../bd/connect");

const addPatient = async (req, res) => {
  try {
    let patient = new Patient({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      sexe: req.body.sexe,
      idMedecin: req.body.idMedecin,
    });

    let result = await client.bd().collection("patients").insertOne(patient);
    console.log("patient added");
    res.status(200).json(result);
  } catch (error) {
    console.log("erreur in add patient");
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { addPatient };
