const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Order Management API running",
  });
});

module.exports = app;