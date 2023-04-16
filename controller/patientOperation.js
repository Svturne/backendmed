const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const TokensPatient = require("../model/TokensPatients");
const client = require("../bd/connect");

const refreshPatient = async (req, res) => {
  delete req.user.iat;
  delete req.user.exp;

  let accessToken = jwt.sign(req.user, process.env.ACCESSTOKENPATIENT, {
    expiresIn: "90s",
  });
  let refreshToken = jwt.sign(req.user, process.env.REFRESHTOKENPATIENT, {
    expiresIn: "365d",
  });

  let token = new TokensPatient({
    token: refreshToken,
    patientId: new ObjectId(req.user._id),
  });

  console.log(token);

  await client
    .bd()
    .collection("tokensPatient")
    .deleteMany({ patientId: new ObjectId(req.user._id) });

  await client.bd().collection("tokensPatient").insertOne(token);

  res.status(200).json({ accessToken, refreshToken, user: req.user });
};

const logout = async (req, res) => {
  try {
    let token = req.headers["authorization"];

    if (token == "" || !token) {
      res.status(401).json({ message: "token is required" });
    } else {
      token = token.split(" ")[1];
      await client.bd().collection("tokensPatient").deleteOne({ token });
      return res.status(200).json({ message: "logout successfully" });
    }
  } catch (error) {
    console.log("error in logout");
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

const getProfilePatient = async (req, res) => {
  try {
    const id = ObjectId(req.user._id);
    let result = await client.bd().collection("patients").findOne({ _id: id });
    delete result.password;
    res.status(200).json(result);
  } catch (error) {
    console.log("erreur in get profile patient");
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { refreshPatient, logout, getProfilePatient };
