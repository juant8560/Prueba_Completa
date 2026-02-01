const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Inicializa Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Exportamos Firestore
const db = admin.firestore();

module.exports = { db };