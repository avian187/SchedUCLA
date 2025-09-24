const admin = require("firebase-admin");
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

// Initialize Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}


module.exports = admin;
