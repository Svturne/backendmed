const express = require("express");
const { connecter } = require("./bd/connect");
const routePatient = require("./route/patient");
const routeMedecin = require("./route/medecin");
const routeVisite = require("./route/visite");
const routeMaladie = require("./route/maladie");
const ip = require("ip");
const routePatientOperation = require("./route/patientOperation");
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/upload", express.static("upload"));
app.use("/api", routePatient);
app.use("/api", routeMedecin);
app.use("/api", routeVisite);
app.use("/api", routeMaladie);
app.use("/api", routePatientOperation);

connecter("mongodb://127.0.0.1:27017/", (erreur) => {
  if (erreur) {
    console.log("ERREUR CONNECTION BDD");
    process.exit(-1);
  } else {
    const server = app.listen(process.env.PORT, () => {
      const host = process.env.BASEURL;
      const port = server.address().port;
      console.log(`Serveur lancé sur ${host}:${port}`);

      const adresseIp = ip.address();
      console.log(`Adresse IP du serveur: ${adresseIp}`);
    });
  }
});
