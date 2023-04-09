const Medecin = require("../model/Medecin");
const client = require("../bd/connect");
const { ObjectId } = require("mongodb");
const transporter = require("../config/sendEmail");
const generatePassword = require("generate-password");

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
    const password = generatedPassword();
    console.log(password);
    let medecin = new Medecin({
      name: req.body.name,
      email: req.body.email,
    });

    let result = await client.bd().collection("medecins").insertOne(medecin);

    let mailOptions = {
      from: '"Med" medapplication3@gmail.com',
      to: req.body.email,
      subject: "Hello",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "error in sending email" });
      }
      console.log("Message sent: %s", info.messageId);
    });
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

module.exports = { addMedecin, getProfileMedecin, uploadPicture };
