const Medecin = require("../model/Medecin");
const client = require("../bd/connect");
const { ObjectId } = require("mongodb");
const transporter = require("../config/sendEmail");
const generatePassword = require("generate-password");
const bcrypt = require("bcrypt");

const getHtml = (email, password) => {
  return `<div> <h1>Création de votre compte sur Med</h1> <p>Votre compte a été créé avec succès. </br>Votre email: ${email} </br> Votre mot de passe: <b>${password}</b></p></div>`;
};

const generatedPassword = () => {
  const password = generatePassword.generate({
    length: process.env.LENGTH,
    numbers: parseInt(process.env.NUMBERS),
    symbols: parseInt(process.env.SYMBOLS),
    uppercase: parseInt(process.env.UPPERCASE),
    excludeSimilarCharacters: parseInt(process.env.EXCLUDESIMILARCHARACTERS),
  });
  return password;
};

const addMedecin = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const name = req.body.name;
    if (email == "" || name == "") {
      return res.status(422).json({ message: "Invalid email or password" });
    }

    let findEmail = await client.bd().collection("medecins").findOne({ email });
    if (findEmail) {
      return res.status(400).json({ message: "email already existe" });
    }

    const password = generatedPassword();

    console.log({ password });

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT));

    const hash = await bcrypt.hash(password, salt);

    let medecin = new Medecin({
      name: name,
      email: email,
      password: hash,
    });

    let result = await client.bd().collection("medecins").insertOne(medecin);

    let mailOptions = {
      from: '"Med" medapplication3@gmail.com',
      to: req.body.email,
      subject: "Création de votre compte",
      text: "",
      html: getHtml(email, password),
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "error in sending email" });
      }
    });
    console.log("medecin added");
    res.status(200).json(result);
  } catch (error) {
    console.log("erreur in add medecin");
    console.log(error);
    res.status(500).json(error);
  }
};

const loginMedecin = async (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  if (email == "" || password == "") {
    return res.status(422).json({ message: "Invalid email or password" });
  }

  let result = await client.bd().collection("medecins").findOne({ email });
  if (!result) {
    return res.status(400).json({ message: "user dosen't existe" });
  }

  const isMatch = await bcrypt.compare(password, result.password);

  if (!isMatch) {
    return res.status(401).json({ message: "email or password is incorrect" });
  }

  delete result.password;
  res.status(200).json(result);
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
  console.log("Uploading picture"); //TODO: get id from token
  try {
    const id = ObjectId(req.params.id);
    let result = await client
      .bd()
      .collection("medecins")
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            profilePicture:
              process.env.BASEURL +
              ":" +
              process.env.PORT +
              "/" +
              req.file.path,
          },
        },
        { new: true }
      );
    res.status(200).json({ message: "image uploaded successfully" });
  } catch (error) {
    console.log("erreur in upload profile picture medecin");
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { addMedecin, getProfileMedecin, uploadPicture, loginMedecin };
