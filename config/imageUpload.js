const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./upload");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      "image" +
        Math.floor(Math.random() * 2147483646) +
        "_" +
        Math.floor(Math.random() * 2147483646) +
        "_" +
        Math.floor(Math.random() * 2147483646) +
        ".jpg"
    );
  },
});

const limite = {
  fileSize: 1024 * 1024 * 6,
};

const fileFilter = (req, file, callback) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage,
  limite,
  fileFilter,
});

module.exports = upload;
