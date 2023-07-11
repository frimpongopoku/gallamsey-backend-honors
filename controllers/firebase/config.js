const admin = require("firebase-admin");

const serviceAccount = require("./../../firebase-service-account-key.json"); // Path to your Firebase service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = {
  firestore: admin.firestore(),
};
