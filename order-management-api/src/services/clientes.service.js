const { db } = require("../firebase/firebase.config");

const COLLECTION = "clientes";

class ClientesService {
    async getAll() {
        const snapshot = await db.collection(COLLECTION).get();
        return snapshot.docs.map(doc => ({ clienteId: doc.id, ...doc.data() }));
    }

    async getById(clienteId) {
        const doc = await db.collection(COLLECTION).doc(clienteId).get();
        if (!doc.exists) return null;
        return { clienteId: doc.id, ...doc.data() };
    }

    async create(cliente) {
        // Validaciones básicas
        if (!cliente.nombre || cliente.nombre.length < 3 || cliente.nombre.length > 100) {
            throw new Error("El nombre debe tener entre 3 y 100 caracteres");
        }
        if (!cliente.identidad) {
            throw new Error("La identidad es requerida");
        }

        // Verificar identidad única
        const existing = await db
            .collection(COLLECTION)
            .where("identidad", "==", cliente.identidad)
            .get();
        if (!existing.empty) {
            throw new Error(`Ya existe un cliente con la identidad ${cliente.identidad}`);
        }

        const docRef = await db.collection(COLLECTION).add({
            nombre: cliente.nombre,
            identidad: cliente.identidad,
            createdAt: new Date(),
        });
        return { clienteId: docRef.id, ...cliente };
    }

    async update(clienteId, cliente) {
        const docRef = db.collection(COLLECTION).doc(clienteId);
        const doc = await docRef.get();
        if (!doc.exists) throw new Error("Cliente no encontrado");

        // Verificar identidad única
        const existing = await db
            .collection(COLLECTION)
            .where("identidad", "==", cliente.identidad)
            .get();
        if (!existing.empty && existing.docs[0].id !== clienteId) {
            throw new Error(`Ya existe un cliente con la identidad ${cliente.identidad}`);
        }

        await docRef.update({
            nombre: cliente.nombre,
            identidad: cliente.identidad,
        });

        return { clienteId, ...cliente };
    }

    async delete(clienteId) {
        const docRef = db.collection("clientes").doc(clienteId);
        const doc = await docRef.get();
        if (!doc.exists) throw new Error("Cliente no encontrado");
        await docRef.delete();
    }
}

module.exports = new ClientesService();