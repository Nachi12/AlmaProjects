// backend/firebaseAdmin.js
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // loads .env

const serviceAccount = require(path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
