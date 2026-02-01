import { useState, useEffect } from "react";

export default function ProductoForm({ onSubmit, initialData }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [existencia, setExistencia] = useState(0);

  // Cuando cambie initialData (al editar), actualiza los campos
  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || "");
      setDescripcion(initialData.descripcion || "");
      setPrecio(initialData.precio || 0);
      setExistencia(initialData.existencia || 0);
    } else {
      setNombre("");
      setDescripcion("");
      setPrecio(0);
      setExistencia(0);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nombre, descripcion, precio: Number(precio), existencia: Number(existencia) });
    // Limpiamos solo si no estamos editando
    if (!initialData) {
      setNombre("");
      setDescripcion("");
      setPrecio(0);
      setExistencia(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="form-control"
        required
      />
      <input
        type="text"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="form-control"
      />
      <input
        type="number"
        placeholder="Precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        className="form-control"
        required
      />
      <input
        type="number"
        placeholder="Existencia"
        value={existencia}
        onChange={(e) => setExistencia(e.target.value)}
        className="form-control"
        required
      />
      <button type="submit" className="btn btn-success mt-2">
        {initialData ? "Actualizar" : "Agregar"} Producto
      </button>
    </form>
  );
}
