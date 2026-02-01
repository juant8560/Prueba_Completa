const { db } = require("./src/firebase/firebase.config");

async function test() {
  try {
    const snapshot = await db.collection("clientes").get();
    console.log("Conexión a Firestore OK. Documentos:", snapshot.size);
  } catch (error) {
    console.error("Error conectando a Firestore:", error);
  }
}

test();