const jwt = require("jsonwebtoken");
const client = require("../bd/connect");

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
  console.log(result);

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

module.exports = { patientFirstAuth, patientAuth };
