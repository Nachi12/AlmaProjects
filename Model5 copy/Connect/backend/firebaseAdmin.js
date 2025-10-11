const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountString) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT env variable is not set');
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountString);
} catch (error) {
  throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON: ' + error.message);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
