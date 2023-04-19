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
  <img src="https://i.postimg.cc/yxpxhHjY/med-icon-modified.png" alt="MED_LOGO" width="250" height="250">
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

const getHtmlCode = (code) => {
  return `<div>
  <h1>Code de vérification</h1>
  <p>Voici votre code de vérification:</br></br>
    ${code}</br></br>
  </p>
  <img src="https://i.postimg.cc/yxpxhHjY/med-icon-modified.png" alt="MED_LOGO" width="250" height="250">
</div>
`;
};

const addMedecin = async (req, res) => {
  try {
    const ownerPassword = req.body.password;
    if (ownerPassword == "" || !ownerPassword) {
      return res.status(422).json({ message: "Invalid password" });
    }

    const isMatch = await bcrypt.compare(ownerPassword, process.env.OWNERPASS);
    console.log(process.env.OWNERPASS);
    if (!isMatch) {
      return res.status(401).json({ message: "Only Owner can create doctors" });
    }

    const email = req.body.email.toLowerCase();
    const name = req.body.name;
    if (email == "" || name == "") {
      return res.status(422).json({ message: "Invalid email" });
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

    await client.bd().collection("medecins").insertOne(medecin);

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

    res.status(200).json({ message: "medecin added" });
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
      expiresIn: "10m",
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
  console.log("Uploading picture");
  try {
    const id = ObjectId(req.user.id);
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
        { returnDocument: "after" }
      );

    delete result.value.password;

    result.value["id"] = result.value["_id"];
    delete result.value["_id"];

    res.status(200).json({ user: result.value });
  } catch (error) {
    console.log("erreur in upload profile picture medecin");
    console.log(error);
    res.status(500).json(error);
  }
};

const changePassword = async (req, res) => {
  const id = ObjectId(req.user.id);
  const password = req.body.password;
  const newPassword = req.body.newPassword;

  const user = await client.bd().collection("medecins").findOne({ _id: id });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "password is incorrect" });
  }

  const salt = await bcrypt.genSalt(parseInt(process.env.SALT));

  const hash = await bcrypt.hash(newPassword, salt);

  await client
    .bd()
    .collection("medecins")
    .findOneAndUpdate(
      { _id: id },
      {
        $set: {
          password: hash,
        },
      },
      { returnDocument: "after" }
    );

  await client.bd().collection("tokensMedecin").deleteMany({ medecinId: id });

  res.status(200).json({ message: "updated successfully" });
};

const sendCodePassword = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    let result = await client.bd().collection("medecins").findOne({ email });
    if (!result) {
      res.status(404).json({ message: "no profile with this email" });
    } else {
      delete result.password;

      const id = result._id;
      const code = Math.floor(1000 + Math.random() * 9000);

      await client
        .bd()
        .collection("medecins")
        .findOneAndUpdate(
          { email },
          {
            $set: {
              codeResetPassword: code,
            },
          },
          { returnDocument: "after" }
        );

      await client
        .bd()
        .collection("tokensMedecin")
        .deleteMany({ medecinId: id });

      let mailOptions = {
        from: '"Med" medapplication3@gmail.com',
        to: req.body.email,
        subject: "Code de vérification",
        text: "",
        html: getHtmlCode(code),
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ message: "error in sending email" });
        }
      });

      res.status(200).json({ message: "code has been sent to your email" });
    }
  } catch (error) {
    console.log("erreur in update code for password");
    console.log(error);
    res.status(500).json(error);
  }
};

const checkCode = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const userCode = parseInt(req.body.code);

    const user = await client.bd().collection("medecins").findOne({ email });

    if (!user.codeResetPassword) {
      res.status(400).json({ message: "repeat the process" });
    }

    if (!userCode) {
      res.status(400).json({ message: "send your code" });
    }

    if (user.codeResetPassword == userCode) {
      res.status(200).json({ message: "Approved" });
    } else {
      res.status(422).json({ message: "wrong code" });
    }
  } catch (error) {
    console.log("error in checkCode");
    console.log(error);
    res.status(500).json(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const code = req.body.code;
    const password = req.body.password;

    const result = await client.bd().collection("medecins").findOne({ email });
    if (!result) {
      return res.status(404).json({ message: "user not found" });
    }

    if (result.codeResetPassword != code) {
      return res.status(404).json({ message: "not found" });
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT));

    const hash = await bcrypt.hash(password, salt);

    client
      .bd()
      .collection("medecins")
      .findOneAndUpdate(
        { email },
        {
          $set: {
            password: hash,
            codeResetPassword: null,
          },
        },
        { returnDocument: "after" }
      );
    res.status(200).json({ message: "password updated successfully" });
  } catch (error) {
    console.log("erreur in resetPassword");
    console.log(error);
    res.status(500).json({ message: "erreur in resetPassword" });
  }
};

module.exports = {
  addMedecin,
  getProfileMedecin,
  uploadPicture,
  loginMedecin,
  logout,
  refreshToken,
  changePassword,
  sendCodePassword,
  checkCode,
  resetPassword,
};
