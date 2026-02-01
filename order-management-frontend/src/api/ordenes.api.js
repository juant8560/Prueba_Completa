const API_URL = "/api/ordenes";

export const getOrdenes = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();  
};

export const createOrden = async (orden) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orden),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
};
