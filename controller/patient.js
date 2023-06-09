const Patient = require("../model/Patient");
const client = require("../bd/connect");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const transporter = require("../config/sendEmail");
const TokensPatient = require("../model/TokensPatients");
const { findOne } = require("../model/Visite");

const getHtml = (qrimage, doctorname) => {
  return `<div>
  <h1>Création de votre compte sur Med</h1>
  <p>Votre compte a été créé par le docteur ${doctorname}.</br></br></p>
  <img src= ${qrimage} alt="MED_LOGO">
  <p>Scannez ce code a l'aide de l'application afin de pouvoir accéder à votre profil.</p>
  <p>(Ce code est scannable qu'une seule fois)</p>
</div>
`;
};

const resendHtml = (qrimage) => {
  return `<div>
  <h1>Voici votre code QR</h1>
  </p>
  <img src= ${qrimage} alt="MED_LOGO">
  <p>Scannez ce code a l'aide de l'application afin de pouvoir accéder à votre profil.</p>
  <p>(Ce code est scannable qu'une seule fois)</p>
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

    sendQr(patient, req.user.name, res);

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

    const maladies = await client
      .bd()
      .collection("maladies")
      .find({ patientId: id });

    const maladieResult = await maladies.toArray();
    for (const maladie of maladieResult) {
      const deleted = await client
        .bd()
        .collection("visites")
        .deleteMany({ maladieId: maladie._id });
    }

    await client.bd().collection("tokensPatient").deleteMany({ patientId: id });
    await client.bd().collection("maladies").deleteMany({ patientId: id });
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
    const medecinId = ObjectId(req.user.id);
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

const getMaladiesDoctor = async (req, res) => {
  try {
    const id = ObjectId(req.params.patientId);

    let allMaladie = await client
      .bd()
      .collection("maladies")
      .find({ patientId: id });

    const result = await allMaladie.toArray();
    if (!result) {
      res.status(404).json({ message: "Not Found maladie for this patient" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const reSendQr = async (req, res) => {
  try {
    let patient = {
      _id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      sexe: req.body.sexe,
      idMedecin: req.user.id,
    };
    const qrCode = await sendQr(patient, undefined, res);

    res.status(200).json({ message: "code qr sended", qrCode });
  } catch (error) {
    console.log("erreur in reSendQr");
    console.log(error);
    res.status(500).json(error);
  }
};

const sendQr = async (patient, doctorname, res) => {
  const refresh = jwt.sign({ patient }, process.env.REFRESHTOKENPATIENT, {
    expiresIn: "365d",
  });

  let token = new TokensPatient({
    token: refresh,
    patientId: new ObjectId(patient._id),
  });

  await client.bd().collection("tokensPatient").insertOne(token);

  const url = new URL("med:/patient/?token=" + refresh);
  console.log(url.href);

  let qrImage = await QRCode.toDataURL(url.href, {
    width: 250,
    height: 250,
    color: { light: "#7FA1D8" },
  });

  let mailOptions = {
    from: '"Med" medapplication3@gmail.com',
    to: patient.email,
    subject: "Création de votre compte",
    text: "",
    attachDataUrls: true,
    html: doctorname ? getHtml(qrImage, doctorname) : resendHtml(qrImage),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "error in sending email" });
    }
  });

  return url.href;
};

module.exports = {
  addPatient,
  deletePatient,
  editPatient,
  getAllPatient,
  getMaladiesDoctor,
  reSendQr,
};
