import { useEffect, useState } from "react";
import { getProductos, createProducto, updateProducto, deleteProducto } from "../api/productos.api";
import ProductoForm from "../components/ProductoForm";
import Navbar from "../components/Navbar";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadProductos = async () => {
    try {
      const res = await getProductos();
      if (res.success) setProductos(res.data);
    } catch (err) {
      alert("Error al cargar productos: " + err.message);
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const handleSubmit = async (data) => {
    if (editing) {
      await updateProducto(editing.productoId, data);
      setEditing(null);
    } else {
      await createProducto(data);
    }
    loadProductos();
  };

  const handleEdit = (producto) => setEditing(producto);
  const handleDelete = async (id) => {
    if (confirm("¿Deseas eliminar este producto?")) {
      await deleteProducto(id);
      loadProductos();
    }
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Productos</h1>
      <div className="row mb-4">
        <div className="col-md-6">
          <h3>{editing ? "Editar Producto" : "Agregar Producto"}</h3>
          <ProductoForm onSubmit={handleSubmit} initialData={editing} />
        </div>
      </div>

      <div className="row">
        {productos.map((p) => (
          <div key={p.productoId} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.nombre}</h5>
                <p className="card-text">{p.descripcion}</p>
                <p className="card-text fw-bold">Precio: ${p.precio.toFixed(2)}</p>
                <p className="card-text">Stock: {p.existencia}</p>
                <div className="mt-auto d-flex justify-content-between">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEdit(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.productoId)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {productos.length === 0 && <p>No hay productos registrados.</p>}
      </div>
    </div>
  );
}