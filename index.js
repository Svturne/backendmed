const express = require("express");
const { connecter } = require("./bd/connect");
const routePatient = require("./route/patient");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", routePatient);

connecter("mongodb://127.0.0.1:27017/", (erreur) => {
  if (erreur) {
    console.log("ERREUR A LA CONNECTION DE LA BDD");
    process.exit(-1);
  } else {
    console.log("Connection a la BDD");
    app.listen(3000);
  }
});
