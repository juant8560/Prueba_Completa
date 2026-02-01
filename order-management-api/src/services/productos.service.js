const { db } = require("../firebase/firebase.config");
const COLLECTION = "productos";

class ProductosService {
    async getAll() {
        const snapshot = await db.collection(COLLECTION).get();
        return snapshot.docs.map(doc => ({ productoId: doc.id, ...doc.data() }));
    }

    async getById(productoId) {
        const doc = await db.collection(COLLECTION).doc(productoId).get();
        if (!doc.exists) return null;
        return { productoId: doc.id, ...doc.data() };
    }

    async create(producto) {
        if (!producto.nombre || producto.nombre.length < 3 || producto.nombre.length > 100)
            throw new Error("El nombre debe tener entre 3 y 100 caracteres");
        if (producto.precio <= 0) throw new Error("El precio debe ser mayor a 0");
        if (producto.existencia < 0) throw new Error("La existencia debe ser >= 0");

        const docRef = await db.collection(COLLECTION).add({
            nombre: producto.nombre,
            descripcion: producto.descripcion || "",
            precio: producto.precio,
            existencia: producto.existencia,
            createdAt: new Date(),
        });

        return { productoId: docRef.id, ...producto };
    }

    async update(productoId, producto) {
        const docRef = db.collection(COLLECTION).doc(productoId);
        const doc = await docRef.get();
        if (!doc.exists) throw new Error("Producto no encontrado");

        await docRef.update({
            nombre: producto.nombre,
            descripcion: producto.descripcion || "",
            precio: producto.precio,
            existencia: producto.existencia,
        });

        return { productoId, ...producto };
    }

    async delete(productoId) {
        const docRef = db.collection("productos").doc(productoId);
        const doc = await docRef.get();
        if (!doc.exists) throw new Error("Producto no encontrado");
        await docRef.delete();
    }

}

module.exports = new ProductosService();
