const { db } = require("../firebase/firebase.config");

const COLLECTION_ORDENES = "ordenes";
const COLLECTION_DETALLE = "detalleOrden";
const COLLECTION_PRODUCTOS = "productos";
const COLLECTION_CLIENTES = "clientes";

class OrdenesService {
  async getAll() {
    const snapshot = await db.collection(COLLECTION_ORDENES).get();
    return snapshot.docs.map(doc => ({ ordenId: doc.id, ...doc.data() }));
  }

  async getById(ordenId) {
    const doc = await db.collection(COLLECTION_ORDENES).doc(ordenId).get();
    if (!doc.exists) return null;

    // Obtener detalles de la orden
    const detallesSnapshot = await db.collection(COLLECTION_DETALLE)
      .where("ordenId", "==", ordenId)
      .get();

    const detalles = detallesSnapshot.docs.map(d => ({ detalleOrdenId: d.id, ...d.data() }));

    return { ordenId: doc.id, ...doc.data(), detalles };
  }

  async create(ordenData) {
    const clienteRef = db.collection(COLLECTION_CLIENTES).doc(ordenData.clienteId);
    const clienteDoc = await clienteRef.get();
    if (!clienteDoc.exists) throw new Error("El cliente especificado no existe");

    let subtotal = 0;
    let impuestoTotal = 0;
    const detalles = [];

    for (const item of ordenData.detalle) {
      const productoRef = db.collection(COLLECTION_PRODUCTOS).doc(item.productoId);
      const productoDoc = await productoRef.get();

      if (!productoDoc.exists) throw new Error(`El producto con ID ${item.productoId} no existe`);

      const producto = productoDoc.data();

      if (producto.existencia < item.cantidad) {
        throw new Error(`El producto '${producto.nombre}' no tiene suficientes existencias. Disponible: ${producto.existencia}, Solicitado: ${item.cantidad}`);
      }

      const sub = producto.precio * item.cantidad;
      const imp = sub * 0.15;
      const total = sub + imp;

      subtotal += sub;
      impuestoTotal += imp;

      // Guardar detalle
      const detalleRef = await db.collection(COLLECTION_DETALLE).add({
        ordenId: "", // temporal, se actualiza luego
        productoId: item.productoId,
        cantidad: item.cantidad,
        subtotal: sub,
        impuesto: imp,
        total: total
      });

      // Actualizar existencia
      await productoRef.update({ existencia: producto.existencia - item.cantidad });

      detalles.push({ detalleOrdenId: detalleRef.id, ordenId: "", productoId: item.productoId, cantidad: item.cantidad, subtotal: sub, impuesto: imp, total });
    }

    // Crear orden
    const ordenRef = await db.collection(COLLECTION_ORDENES).add({
      clienteId: ordenData.clienteId,
      subtotal,
      impuesto: impuestoTotal,
      total: subtotal + impuestoTotal,
      fechaCreacion: new Date()
    });

    // Actualizar detalles con ordenId
    for (const d of detalles) {
      await db.collection(COLLECTION_DETALLE).doc(d.detalleOrdenId).update({ ordenId: ordenRef.id });
      d.ordenId = ordenRef.id;
    }

    return { ordenId: ordenRef.id, clienteId: ordenData.clienteId, subtotal, impuesto: impuestoTotal, total: subtotal + impuestoTotal, detalles };
  }
}

module.exports = new OrdenesService();
