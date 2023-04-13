const Patient = require("../model/Patient");
const client = require("../bd/connect");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const transporter = require("../config/sendEmail");

const getHtml = (qrimage) => {
  return `<div>
  <h1>Création de votre compte sur Med</h1>
  <p>Votre compte a été créé avec succès.</br></br>
   
  </p>
  <img src= ${qrimage} alt="MED_LOGO">
</div>
`;
};

const addPatient = async (req, res) => {
  try {
    let patient = new Patient({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      sexe: req.body.sexe,
      idMedecin: req.user.id,
    });

    await client.bd().collection("patients").insertOne(patient);

    sendQr(patient);
    res.status(200).json({ message: "patient created successfully" });
  } catch (error) {
    console.log("erreur in add patient");
    console.log(error);
    res.status(500).json(error);
  }
};

const deletePatient = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    let result = await client
      .bd()
      .collection("patients")
      .deleteOne({ _id: id });

    res.status(200).json(result);
  } catch (error) {
    console.log("erreur delete patient");
    console.log(error);
    res.status(500).json(error);
  }
};

const editPatient = async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const newName = req.body.name;
    const newEmail = req.body.email;
    const newAge = req.body.age;
    const newSexe = req.body.sexe;
    let result = await client
      .bd()
      .collection("patients")
      .updateOne(
        { _id: id },
        { $set: { name: newName, email: newEmail, age: newAge, sexe: newSexe } }
      );
    res.status(200).json(result);
  } catch (error) {
    console.log("erreur in editePatient");
    console.log(error);
    res.status(500).json(error);
  }
};

const getAllPatient = async (req, res) => {
  try {
    const medecinId = ObjectId(req.params.medecinId);
    const allPatient = client
      .bd()
      .collection("patients")
      .find({ idMedecin: medecinId });
    const result = await allPatient.toArray();

    res.status(200).json(result);
  } catch (error) {
    console.log("erreur in get all Patient");
    console.log(error);
    res.status(500).json(error);
  }
};

const sendQr = async (patient) => {
  const refresh = jwt.sign(patient.toJSON(), process.env.REFRESHTOKENPATIENT, {
    expiresIn: "365d",
  });

  const url = new URL("med://token=" + refresh);

  QRCode.toString(
    url.href,
    {
      errorCorrectionLevel: "H",
      type: "png",
      width: "50",
    },
    function (err, data) {
      if (err) throw err;

      // let mailOptions = {
      //   from: '"Med" medapplication3@gmail.com',
      //   to: "mehdi.bad@outlook.com",
      //   subject: "Création de votre compte",
      //   text: "",
      //   html: getHtml(data),
      // };
      // transporter.sendMail(mailOptions, (error, info) => {
      //   if (error) {
      //     return res.status(500).json({ message: "error in sending email" });
      //   }
      // });
      console.log(data);
    }
  );
};

module.exports = { addPatient, deletePatient, editPatient, getAllPatient };
