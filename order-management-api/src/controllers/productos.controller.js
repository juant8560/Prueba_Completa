const service = require("../services/productos.service");
const ApiResponse = require("../utils/apiResponse");

class ProductosController {
    async getAll(req, res) {
        try {
            const productos = await service.getAll();
            ApiResponse.success(res, productos);
        } catch (error) {
            ApiResponse.error(res, "Error obteniendo productos", [error.message], 500);
        }
    }

    async getById(req, res) {
        try {
            const producto = await service.getById(req.params.id);
            if (!producto) return ApiResponse.error(res, "Producto no encontrado", ["No existe un producto con el ID especificado"], 404);
            ApiResponse.success(res, producto);
        } catch (error) {
            ApiResponse.error(res, "Error obteniendo producto", [error.message], 500);
        }
    }

    async create(req, res) {
        try {
            const producto = await service.create(req.body);
            ApiResponse.success(res, producto, "Producto creado exitosamente");
        } catch (error) {
            ApiResponse.error(res, "Error al crear producto", [error.message]);
        }
    }

    async update(req, res) {
        try {
            const producto = await service.update(req.params.id, req.body);
            ApiResponse.success(res, producto, "Producto actualizado exitosamente");
        } catch (error) {
            ApiResponse.error(res, "Error al actualizar producto", [error.message]);
        }
    }

    async delete(req, res) {
        try {
            await service.delete(req.params.id);
            res.json({ success: true, message: "Producto eliminado", errors: [], data: null });
        } catch (error) {
            res.status(400).json({ success: false, message: "Error al eliminar producto", errors: [error.message], data: null });
        }
    }

}

module.exports = new ProductosController();
