const API_URL = "/api/productos";

export const getProductos = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};

export const getProductoById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};

export const createProducto = async (producto) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};

export const updateProducto = async (id, producto) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};

export const deleteProducto = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};
