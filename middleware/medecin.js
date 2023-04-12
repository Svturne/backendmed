const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "not authorized" });
  }
  token = token.split(" ")[1];

  jwt.verify(token, process.env.ACCESSTOKEN, (err, user) => {
    if (!err) {
      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: "user not authorized" });
    }
  });
};

module.exports = { auth };
