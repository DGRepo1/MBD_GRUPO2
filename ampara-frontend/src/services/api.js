// src/services/api.js
const BASE_URL = 'http://localhost:3000/api/admin';

export async function obtenerCasos() {
  const res = await fetch(`${BASE_URL}/casos`);
  return await res.json();
}

export async function obtenerAbogados() {
  const res = await fetch(`${BASE_URL}/abogados`);
  return await res.json();
}

export async function asignarCaso(idCaso, idAbogado) {
  const res = await fetch(`${BASE_URL}/asignar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idCaso, idAbogado }),
  });
  return await res.json();
}
