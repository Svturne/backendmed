const { MongoClient } = require("mongodb");

var client = null;

function connecter(url, callback) {
  if (client == null) {
    client = new MongoClient(url);

    client.connect((error) => {
      if (error) {
        client = null;
        callback(error);
      } else {
        callback();
      }
    });
  } else {
    callback();
  }
}

function bd() {
  return new Db(client, "med");
}

function closeConnection() {
  if (client) {
    client.close();
    client = null;
  }
}

module.exports = { connecter, bd, closeConnection };
