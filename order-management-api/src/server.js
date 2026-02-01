const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const clientesRoutes = require("./routes/clientes.routes");
app.use("/api/clientes", clientesRoutes);

const productosRoutes = require("./routes/productos.routes");
app.use("/api/productos", productosRoutes);

const ordenesRoutes = require("./routes/ordenes.routes");
app.use("/api/ordenes", ordenesRoutes);


// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});