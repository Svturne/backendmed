const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const client = require("../bd/connect");
const collections = require("../constants/collections");

const patientFirstAuth = async (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "not authorized" });
  }
  token = token.split(" ")[1];

  const result = await client
    .bd()
    .collection("tokensPatient")
    .findOne({ token });

  if (!result) {
    return res.status(401).json({ message: "token invalide" });
  }

  jwt.verify(token, process.env.REFRESHTOKENPATIENT, (err, user) => {
    if (!err) {
      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: "user not authorized" });
    }
  });
};

const patientAuth = async (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "not authorized" });
  }
  token = token.split(" ")[1];

  jwt.verify(token, process.env.ACCESSTOKENPATIENT, (err, user) => {
    if (!err) {
      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: "user not authorized" });
    }
  });
};

const patientVerifaction = async (req, res, next) => {
  const patientId = ObjectId(req.user._id);

  const maladieId = new ObjectId(req.params.id);

  const resultBdd = await client.bd().collection("maladies").findOne({
    _id: maladieId,
  });

  if (!resultBdd) {
    return res.status(404).json({ message: "maladie not found" });
  }

  if (patientId.equals(resultBdd.patientId)) {
    next();
  } else {
    res.status(401).json({ message: "not authorized to see this maladie" });
  }
};

module.exports = { patientFirstAuth, patientAuth, patientVerifaction };
