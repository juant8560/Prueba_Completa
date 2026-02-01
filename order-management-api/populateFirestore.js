const { db } = require("./src/firebase/firebase.config"); // tu configuración de Firebase

async function populate() {
  try {
    // --------------------
    // CLIENTES
    // --------------------
    const clientes = [
      { nombre: 'Juan Pérez', identidad: '0801-1990-12345', createdAt: new Date() },
      { nombre: 'María González', identidad: '0801-1985-67890', createdAt: new Date() },
      { nombre: 'Carlos Rodríguez', identidad: '0801-1992-11111', createdAt: new Date() }
    ];

    const clienteRefs = [];
    for (const cliente of clientes) {
      const ref = await db.collection("clientes").add(cliente);
      clienteRefs.push({ id: ref.id, ...cliente });
    }

    // --------------------
    // PRODUCTOS
    // --------------------
    const productos = [
      { nombre: 'Laptop Dell XPS 15', descripcion: 'Laptop de alto rendimiento', precio: 1299.99, existencia: 50, createdAt: new Date() },
      { nombre: 'Mouse Logitech MX Master 3', descripcion: 'Mouse ergonómico inalámbrico', precio: 99.99, existencia: 150, createdAt: new Date() },
      { nombre: 'Teclado Mecánico Keychron K2', descripcion: 'Teclado mecánico retroiluminado', precio: 89.99, existencia: 75, createdAt: new Date() },
      { nombre: 'Monitor LG 27" 4K', descripcion: 'Monitor 4K UHD', precio: 449.99, existencia: 30, createdAt: new Date() },
      { nombre: 'Webcam Logitech C920', descripcion: 'Webcam Full HD 1080p', precio: 79.99, existencia: 100, createdAt: new Date() }
    ];

    const productoRefs = [];
    for (const producto of productos) {
      const ref = await db.collection("productos").add(producto);
      productoRefs.push({ id: ref.id, ...producto });
    }

    // --------------------
    // ORDENES
    // --------------------
    // Ejemplo: Una orden del primer cliente
    const ordenes = [
      {
        clienteId: clienteRefs[0].id,
        impuesto: 0,
        subtotal: 0,
        total: 0,
        fechaCreacion: new Date()
      }
    ];

    const ordenRefs = [];
    for (const orden of ordenes) {
      const ref = await db.collection("ordenes").add(orden);
      ordenRefs.push({ id: ref.id, ...orden });
    }

    // --------------------
    // DETALLE ORDEN
    // --------------------
    const detalles = [
      {
        ordenId: ordenRefs[0].id,
        productoId: productoRefs[0].id,
        cantidad: 2,
        subtotal: productoRefs[0].precio * 2,
        impuesto: productoRefs[0].precio * 2 * 0.15, // 15%
        total: productoRefs[0].precio * 2 * 1.15
      },
      {
        ordenId: ordenRefs[0].id,
        productoId: productoRefs[2].id,
        cantidad: 1,
        subtotal: productoRefs[2].precio,
        impuesto: productoRefs[2].precio * 0.15,
        total: productoRefs[2].precio * 1.15
      }
    ];

    for (const detalle of detalles) {
      await db.collection("detalleOrden").add(detalle);
    }

    console.log("Firestore poblado con datos de prueba ✅");
  } catch (error) {
    console.error("Error poblando Firestore:", error);
  }
}

populate();
