const service = require("../services/clientes.service");

class ClientesController {
  async getAll(req, res) {
    try {
      const clientes = await service.getAll();
      res.json({ success: true, message: "", errors: [], data: clientes });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error obteniendo clientes", errors: [error.message], data: null });
    }
  }

  async getById(req, res) {
    try {
      const cliente = await service.getById(req.params.id);
      if (!cliente) {
        return res.status(404).json({ success: false, message: "Cliente no encontrado", errors: ["No existe un cliente con el ID especificado"], data: null });
      }
      res.json({ success: true, message: "", errors: [], data: cliente });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error obteniendo cliente", errors: [error.message], data: null });
    }
  }

  async create(req, res) {
    try {
      const cliente = await service.create(req.body);
      res.json({ success: true, message: "Cliente creado exitosamente", errors: [], data: cliente });
    } catch (error) {
      res.status(400).json({ success: false, message: "Error al crear el cliente", errors: [error.message], data: null });
    }
  }

  async update(req, res) {
    try {
      const cliente = await service.update(req.params.id, req.body);
      res.json({ success: true, message: "Cliente actualizado exitosamente", errors: [], data: cliente });
    } catch (error) {
      res.status(400).json({ success: false, message: "Error al actualizar cliente", errors: [error.message], data: null });
    }
  }

  async delete(req, res) {
  try {
    await service.delete(req.params.id);
    res.json({ success: true, message: "Cliente eliminado", errors: [], data: null });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error al eliminar cliente", errors: [error.message], data: null });
  }
}
}

module.exports = new ClientesController();