import { useEffect, useState } from "react";
import { getClientes } from "../api/clientes.api";
import { getProductos } from "../api/productos.api";
import { createOrden, getOrdenes } from "../api/ordenes.api";

export default function OrdenForm() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [orden, setOrden] = useState({ clienteId: "", detalle: [] });
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [ordenesExistentes, setOrdenesExistentes] = useState([]);
  const [mostrarOrdenes, setMostrarOrdenes] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesRes = await getClientes();
        if (clientesRes.success) setClientes(clientesRes.data);

        const productosRes = await getProductos();
        if (productosRes.success) setProductos(productosRes.data);
      } catch (err) {
        console.error("Error cargando clientes o productos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const agregarProducto = (producto) => {
    const exists = orden.detalle.find(d => d.productoId === producto.productoId);
    if (exists) return;
    setOrden(prev => ({
      ...prev,
      detalle: [...prev.detalle, { ...producto, cantidad: 1 }]
    }));
  };

  const actualizarCantidad = (productoId, delta) => {
    setOrden(prev => {
      let nuevosDetalles = prev.detalle.map(d => {
        if (d.productoId === productoId) {
          let nuevaCantidad = d.cantidad + delta;
          if (nuevaCantidad < 0) nuevaCantidad = 0;
          if (nuevaCantidad > d.existencia) nuevaCantidad = d.existencia;
          return { ...d, cantidad: nuevaCantidad };
        }
        return d;
      });

      nuevosDetalles = nuevosDetalles.filter(d => d.cantidad > 0);

      return { ...prev, detalle: nuevosDetalles };
    });
  };

  const calcularTotales = (detalle) => {
    return detalle.map(d => {
      const subtotal = d.precio * d.cantidad;
      const impuesto = subtotal * 0.15;
      const total = subtotal + impuesto;
      return { ...d, subtotal, impuesto, total };
    });
  };

  const totalesOrden = (detalle) => {
    const subtotalTotal = detalle.reduce((acc, d) => acc + d.subtotal, 0);
    const impuestoTotal = detalle.reduce((acc, d) => acc + d.impuesto, 0);
    const totalFinal = subtotalTotal + impuestoTotal;
    return { subtotalTotal, impuestoTotal, totalFinal };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orden.clienteId) return alert("Selecciona un cliente");
    if (orden.detalle.length === 0) return alert("Agrega al menos un producto");

    const detalleCalculado = calcularTotales(orden.detalle);
    const { subtotalTotal, impuestoTotal, totalFinal } = totalesOrden(detalleCalculado);

    try {
      const res = await createOrden({
        clienteId: orden.clienteId,
        detalle: detalleCalculado.map(d => ({
          productoId: d.productoId,
          cantidad: d.cantidad,
          subtotal: d.subtotal,
          impuesto: d.impuesto,
          total: d.total
        })),
        subtotal: subtotalTotal,
        impuesto: impuestoTotal,
        total: totalFinal
      });

      if (res.success) {
        setMensaje("Orden creada correctamente");
        setOrden({ clienteId: "", detalle: [] });
      } else {
        setMensaje("Error: " + res.errors.join(", "));
      }
    } catch (err) {
      setMensaje("Error al crear orden: " + err.message);
    }
  };

  const toggleOrdenesExistentes = async () => {
    if (!mostrarOrdenes) {
      try {
        const res = await getOrdenes();
        if (res.success) setOrdenesExistentes(res.data);
        setMostrarOrdenes(true);
      } catch (err) {
        alert("Error al cargar órdenes: " + err.message);
      }
    } else {
      setMostrarOrdenes(false);
    }
  };

  if (loading) return <p>Cargando clientes y productos...</p>;

  const detalleCalculado = calcularTotales(orden.detalle);
  const { subtotalTotal, impuestoTotal, totalFinal } = totalesOrden(detalleCalculado);

  return (
    <div>
      <h2>Crear Orden</h2>

      {mostrarOrdenes && (
        <div className="mb-4">
          {ordenesExistentes.length === 0 ? (
            <p>No hay órdenes registradas.</p>
          ) : (
            <div className="list-group">
              {ordenesExistentes.map((o, idx) => (
                <div key={idx} className="list-group-item">
                  <strong>Cliente:</strong> {o.clienteId} <br />
                  <strong>Subtotal:</strong> ${o.subtotal.toFixed(2)} | 
                  <strong>Impuesto:</strong> ${o.impuesto.toFixed(2)} | 
                  <strong>Total:</strong> ${o.total.toFixed(2)}
                  <ul>
                    {o.detalle.map(d => (
                      <li key={d.productoId}>
                        Producto: {d.productoId} - Cantidad: {d.cantidad} - Subtotal: ${d.subtotal.toFixed(2)} - Impuesto: ${d.impuesto.toFixed(2)} - Total: ${d.total.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Cliente</label>
          <select
            className="form-select"
            value={orden.clienteId}
            onChange={(e) => setOrden({ ...orden, clienteId: e.target.value })}
            required
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map(c => (
              <option key={c.clienteId} value={c.clienteId}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Productos</label>
          <ul className="list-group">
            {productos.map(p => (
              <li key={p.productoId} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{p.nombre} - Stock: {p.existencia} - ${p.precio}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => agregarProducto(p)}
                  disabled={orden.detalle.find(d => d.productoId === p.productoId)}
                >
                  Agregar
                </button>
              </li>
            ))}
          </ul>
        </div>

        {detalleCalculado.length > 0 && (
          <div className="mt-3">
            <h4>Detalles de la Orden</h4>
            <ul className="list-group mb-2">
              {detalleCalculado.map(d => (
                <li key={d.productoId} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{d.nombre}</strong> - ${d.precio} x {d.cantidad} = ${d.subtotal.toFixed(2)}
                    <br />
                    Impuesto: ${d.impuesto.toFixed(2)} | Total: ${d.total.toFixed(2)}
                  </div>
                  <div>
                    <button type="button" className="btn btn-sm btn-secondary me-1" onClick={() => actualizarCantidad(d.productoId, -1)}>-</button>
                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => actualizarCantidad(d.productoId, 1)}>+</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-top pt-2">
              <p>Subtotal: ${subtotalTotal.toFixed(2)}</p>
              <p>Impuesto (15%): ${impuestoTotal.toFixed(2)}</p>
              <p><strong>Total: ${totalFinal.toFixed(2)}</strong></p>
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-success mt-3">Crear Orden</button>
      </form>

      {mensaje && <p className="mt-2">{mensaje}</p>}
    </div>
  );
}
