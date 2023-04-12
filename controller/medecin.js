const Medecin = require("../model/Medecin");
const client = require("../bd/connect");
const { ObjectId } = require("mongodb");
const transporter = require("../config/sendEmail");
const generatePassword = require("generate-password");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TokensMedecin = require("../model/TokensMedecin");

const getHtml = (email, password) => {
  return `<div>
  <h1>Création de votre compte sur Med</h1>
  <p>Votre compte a été créé avec succès.</br></br>
    Votre email: ${email}</br></br>
    Votre mot de passe: <b>${password}</b>
  </p>
  <img src="https://i.postimg.cc/yxpxhHjY/med-icon-modified.png" alt="MED_LOGO">
</div>
`;
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

    const data = { id: result.insertedId, name, email };

    let accessToken = jwt.sign(data, process.env.ACCESSTOKEN, {
      expiresIn: "90s",
    });
    let refreshToken = jwt.sign(data, process.env.REFRESHTOKEN, {
      expiresIn: "7d",
    });

    let token = new TokensMedecin({
      token: refreshToken,
      medecinId: result.insertedId,
    });

    await client.bd().collection("tokensMedecin").insertOne(token);

    // let mailOptions = {
    //   from: '"Med" medapplication3@gmail.com',
    //   to: req.body.email,
    //   subject: "Création de votre compte",
    //   text: "",
    //   html: getHtml(email, password),
    // };
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     return res.status(500).json({ message: "error in sending email" });
    //   }
    // });

    console.log("medecin added");
    const allData = { accessToken, refreshToken, user: data };
    res.status(200).json(allData);
  } catch (error) {
    console.log("erreur in add medecin");
    console.log(error);
    res.status(500).json(error);
  }
};

const refreshToken = async (req, res) => {
  try {
    let token = req.headers["authorization"];

    if (token == "" || !token) {
      return res.status(401).json({ message: "token is required" });
    }

    token = token.split(" ")[1];

    const result = await client
      .bd()
      .collection("tokensMedecin")
      .findOne({ token });
    console.log(result);
    if (!result) {
      return res.status(401).json({ message: "token invalide" });
    }

    const user = await client
      .bd()
      .collection("medecins")
      .findOne({ _id: result.medecinId });

    delete user.password;

    user["id"] = user["_id"];
    delete user["_id"];

    let accessToken = jwt.sign(user, process.env.ACCESSTOKEN, {
      expiresIn: "90s",
    });
    let refreshToken = jwt.sign(user, process.env.REFRESHTOKEN, {
      expiresIn: "7d",
    });

    let newToken = new TokensMedecin({
      token: refreshToken,
      medecinId: result.medecinId,
    });

    await client.bd().collection("tokensMedecin").insertOne(newToken);
    await client.bd().collection("tokensMedecin").deleteOne({ token });

    const allData = { accessToken, refreshToken, user };

    res.status(200).json(allData);
  } catch (error) {}
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

  result["id"] = result["_id"];
  delete result["_id"];

  let accessToken = jwt.sign(result, process.env.ACCESSTOKEN, {
    expiresIn: "90s",
  });
  let refreshToken = jwt.sign(result, process.env.REFRESHTOKEN, {
    expiresIn: "7d",
  });

  let token = new TokensMedecin({
    token: refreshToken,
    medecinId: result.id,
  });

  await client.bd().collection("tokensMedecin").insertOne(token);

  const allData = { accessToken, refreshToken, user: result };

  res.status(200).json(allData);
};

const getProfileMedecin = async (req, res) => {
  try {
    const id = ObjectId(req.user.id);
    let result = await client.bd().collection("medecins").findOne({ _id: id });
    delete result.password;
    res.status(200).json(result);
  } catch (error) {
    console.log("erreur in get profile medecin");
    console.log(error);
    res.status(500).json(error);
  }
};

const logout = async (req, res) => {
  try {
    let token = req.headers["authorization"];

    if (token == "" || !token) {
      res.status(401).json({ message: "token is required" });
    } else {
      token = token.split(" ")[1];
      await client.bd().collection("tokensMedecin").deleteOne({ token });
      return res.status(200).json({ message: "logout successfully" });
    }
  } catch (error) {
    console.log("error in logout");
    console.log(error);
    res.status(500).json({ message: "server error" });
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

module.exports = {
  addMedecin,
  getProfileMedecin,
  uploadPicture,
  loginMedecin,
  logout,
  refreshToken,
};
