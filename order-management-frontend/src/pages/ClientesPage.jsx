import { useEffect, useState } from "react";
import ClientesList from "../components/ClientesList";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../api/clientes.api";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadClientes = async () => {
    try {
      const res = await getClientes();
      if (res.success) setClientes(res.data);
    } catch {
      alert("Error al cargar clientes");
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const handleSave = async (data) => {
    try {
      if (!editing) {
        const duplicado = clientes.some(
          (c) => c.identidad === data.identidad
        );
        if (duplicado) {
          alert("Ya existe un cliente con esa identidad");
          return;
        }
        await createCliente(data);
      } else {
        await updateCliente(editing.clienteId, data);
        setEditing(null);
      }
      loadClientes();
    } catch (err) {
      alert(err.message || "Error al guardar cliente");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar cliente?")) return;
    await deleteCliente(id);
    loadClientes();
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Clientes</h1>

      <ClientesList
        clientes={clientes}
        editing={editing}
        onEdit={setEditing}
        onDelete={handleDelete}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
      />
    </div>
  );
}
