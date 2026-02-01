const express = require("express");
const router = express.Router();
const controller = require("../controllers/ordenes.controller");

// Rutas de órdenes
router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/", controller.createOrden.bind(controller));

module.exports = router;
