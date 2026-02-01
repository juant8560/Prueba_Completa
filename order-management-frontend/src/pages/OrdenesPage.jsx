import { useEffect, useState } from "react";
import { getClientes } from "../api/clientes.api";
import { getProductos } from "../api/productos.api";
import { getOrdenes } from "../api/ordenes.api";
import OrdenForm from "../components/OrdenForm";

export default function OrdenesPage() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ordenesExistentes, setOrdenesExistentes] = useState([]);
  const [mostrarOrdenes, setMostrarOrdenes] = useState(false);

  // Cargar clientes y productos al inicio
  useEffect(() => {
    (async () => {
      try {
        const clientesRes = await getClientes();
        if (clientesRes.success) setClientes(clientesRes.data);
        const productosRes = await getProductos();
        if (productosRes.success) setProductos(productosRes.data);
      } catch (err) {
        console.error("Error cargando clientes o productos:", err);
      }
    })();
  }, []);

  const handleVerOrdenes = async () => {
    try {
      const res = await getOrdenes();
      if (res.success) {
        setOrdenesExistentes(res.data || []);
        setMostrarOrdenes(true);
      }
    } catch (err) {
      console.error("Error al cargar órdenes:", err);
      alert("Error al cargar órdenes");
    }
  };

  const handleOcultarOrdenes = () => {
    setMostrarOrdenes(false);
  };

  return (
    <div>
      <h1>Órdenes</h1>

      {!mostrarOrdenes ? (
        <button className="btn btn-secondary mb-3" onClick={handleVerOrdenes}>
          Ver órdenes existentes
        </button>
      ) : (
        <button className="btn btn-warning mb-3" onClick={handleOcultarOrdenes}>
          Ocultar órdenes
        </button>
      )}

      {mostrarOrdenes && (
        <div className="mb-5">
          {ordenesExistentes.length === 0 ? (
            <p>No hay órdenes registradas.</p>
          ) : (
            ordenesExistentes.map((orden) => (
              <div key={orden.ordenId} className="card mb-3 p-3 shadow-sm">
                <h5 className="card-title">
                  Cliente: {clientes.find(c => c.clienteId === orden.clienteId)?.nombre || "Desconocido"}
                </h5>
                <ul className="list-group list-group-flush">
                  {orden.detalle?.map((d, idx) => {
                    const producto = productos.find(p => p.productoId === d.productoId);
                    if (!producto || d.cantidad === 0) return null; // Ignorar productos con cantidad 0
                    return (
                      <li key={idx} className="list-group-item d-flex justify-content-between">
                        {producto.nombre} - Cantidad: {d.cantidad}
                        <span>
                          Subtotal: ${d.subtotal.toFixed(2)}, Impuesto: ${d.impuesto.toFixed(2)}, Total: ${d.total.toFixed(2)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-2">
                  <strong>Subtotal:</strong> ${orden.subtotal.toFixed(2)} |{" "}
                  <strong>Impuesto:</strong> ${orden.impuesto.toFixed(2)} |{" "}
                  <strong>Total:</strong> ${orden.total.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <OrdenForm clientes={clientes} productos={productos} />
    </div>
  );
}
