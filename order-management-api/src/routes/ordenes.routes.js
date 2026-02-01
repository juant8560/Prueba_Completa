const express = require("express");
const router = express.Router();
const controller = require("../controllers/ordenes.controller");

// Rutas
router.get("/", controller.getAll.bind(controller)); // Opcional: listar órdenes
router.get("/:id", controller.getById.bind(controller));
router.post("/", controller.create.bind(controller));

module.exports = router;
