import { useEffect, useState } from "react";

export default function ClientesList({
  clientes,
  editing,
  onEdit,
  onDelete,
  onSave,
  onCancel,
}) {
  const [nombre, setNombre] = useState("");
  const [identidad, setIdentidad] = useState("");

  useEffect(() => {
    if (editing) {
      setNombre(editing.nombre);
      setIdentidad(editing.identidad);
    } else {
      setNombre("");
      setIdentidad("");
    }
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ nombre, identidad });

    // 🧼 Limpiar campos después de agregar
    if (!editing) {
      setNombre("");
      setIdentidad("");
    }
  };

  return (
    <div>
      {/* FORMULARIO */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title mb-3">
            {editing ? "Editar Cliente" : "Nuevo Cliente"}
          </h4>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Identidad</label>
              <input
                type="text"
                className="form-control"
                value={identidad}
                onChange={(e) => setIdentidad(e.target.value)}
                required
              />
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className={`btn ${
                  editing ? "btn-warning" : "btn-success"
                }`}
              >
                {editing ? "Actualizar" : "Agregar"}
              </button>

              {editing && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onCancel}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* LISTA */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-3">Listado de Clientes</h4>

          {!clientes.length ? (
            <p className="text-muted">No hay clientes registrados</p>
          ) : (
            <ul className="list-group list-group-flush">
              {clientes.map((c) => (
                <li
                  key={c.clienteId}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{c.nombre}</strong>
                    <br />
                    <small className="text-muted">{c.identidad}</small>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => onEdit(c)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(c.clienteId)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
