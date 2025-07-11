// src/services/api.js
const BASE_URL = 'http://localhost:3000/api/admin';

export async function obtenerCasos() {
  const res = await fetch('http://localhost:3000/api/casos');
  if (!res.ok) throw new Error('Error al obtener casos');
  return await res.json();
}

export async function obtenerAbogados() {
  const res = await fetch('http://localhost:3000/api/abogados');
  if (!res.ok) throw new Error('Error al obtener abogados');
  return await res.json();
}


export async function asignarCaso(idCasoLegal, idAbogado) {
  const res = await fetch('http://localhost:3000/api/asignaciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idCasoLegal, idAbogado }),
  });

  if (!res.ok) {
    const text = await res.text();  // Captura error legible
    throw new Error(`Error HTTP ${res.status}: ${text}`);
  }

  return await res.json();
}

export async function obtenerClientes() {
  const res = await fetch('http://localhost:3000/api/clientes');
  if (!res.ok) throw new Error('Error al obtener clientes');
  return await res.json();
}

export async function obtenerCasosPorAbogado(idAbogado) {
  const res = await fetch(`http://localhost:3000/api/casos/${idAbogado}`);
  if (!res.ok) throw new Error('Error al obtener casos por abogado');
  return await res.json();
}


