const admin = require('firebase-admin');
const path = require('"./connetct-834c8-firebase-adminsdk-fbsvc-37d43f7d53.json"');

// Path to your Firebase service account key file (download from Firebase console)
const serviceAccountPath = path.resolve(__dirname, '../path/to/serviceAccountKey.json');

const serviceAccount = require("./connetct-834c8-firebase-adminsdk-fbsvc-37d43f7d53.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
