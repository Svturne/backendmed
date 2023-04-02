const Patient = require("../model/Patient");
const client = require("../bd/connect");

const addPatient = async (req, res) => {
  try {
    let patient = new Patient(
      req.body.name,
      req.body.email,
      req.body.age,
      req.body.sexe,
      req.body.idMedecin
    );
    let result = await client.bd().collection("patients").insertOne(patient);
    res.status(200).json(result);
  } catch (error) {
    console.log("erreur in add patient");
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { addPatient };
