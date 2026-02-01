const API_URL = "/api/clientes";

export const getClientes = async () => {
  const res = await fetch("/api/clientes");
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};

export const getClienteById = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
};

export const createCliente = async (cliente) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
};

export const updateCliente = async (id, cliente) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
};

export const deleteCliente = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
};
