// ordenes.controller.js
const admin = require("../firebase"); // tu inicialización de Firebase
const db = admin.firestore();

async function createOrden(req, res) {
  const { clienteId, detalle } = req.body;

  try {
    await db.runTransaction(async (transaction) => {
      // 1. Validar cliente
      const clienteRef = db.collection("clientes").doc(clienteId);
      const clienteSnap = await transaction.get(clienteRef);
      if (!clienteSnap.exists) throw new Error("Cliente no existe");

      // 2. Crear orden inicial
      const ordenRef = db.collection("ordenes").doc();
      const ordenData = { clienteId, impuesto: 0, subtotal: 0, total: 0, fechaCreacion: new Date() };
      transaction.set(ordenRef, ordenData);

      let subtotalOrden = 0;
      let impuestoOrden = 0;
      let totalOrden = 0;

      // 3. Por cada detalle
      for (const item of detalle) {
        const productoRef = db.collection("productos").doc(item.productoId);
        const productoSnap = await transaction.get(productoRef);
        if (!productoSnap.exists) throw new Error(`Producto con ID ${item.productoId} no existe`);

        const producto = productoSnap.data();

        // Validar existencia suficiente
        if (producto.existencia < item.cantidad)
          throw new Error(`No hay suficiente stock para ${producto.nombre}`);

        const subtotal = item.cantidad * producto.precio;
        const impuesto = subtotal * 0.15;
        const total = subtotal + impuesto;

        // Crear registro de DetalleOrden
        const detalleRef = db.collection("detalleOrdenes").doc();
        transaction.set(detalleRef, {
          ordenId: ordenRef.id,
          productoId: item.productoId,
          cantidad: item.cantidad,
          subtotal,
          impuesto,
          total,
        });

        // Actualizar existencia
        transaction.update(productoRef, { existencia: producto.existencia - item.cantidad });

        // Acumular totales
        subtotalOrden += subtotal;
        impuestoOrden += impuesto;
        totalOrden += total;
      }

      // 4. Actualizar orden con totales
      transaction.update(ordenRef, { subtotal: subtotalOrden, impuesto: impuestoOrden, total: totalOrden });
    });

    res.json({ success: true, message: "Orden creada correctamente", errors: [], data: null });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error al crear orden", errors: [err.message], data: null });
  }
}

module.exports = { createOrden };
