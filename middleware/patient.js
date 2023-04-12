const { ObjectId } = require("mongodb");
const client = require("../bd/connect");

const isMedecinperm = async (req, res, next) => {
  const medecinID = new ObjectId(req.user.id);

  const patientId = new ObjectId(req.params.id);

  const result = await client
    .bd()
    .collection("patients")
    .findOne({ _id: patientId });
  if (!result) {
    return res.status(404).json({ message: "patient not found" });
  }
  if (medecinID.equals(result.idMedecin)) {
    next();
  } else {
    res.status(401).json({ message: "not authorized" });
  }
};

module.exports = { isMedecinperm };
