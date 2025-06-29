// src/utils/notificaciones.js

export function asignarCasoSimulado(idAbogado, nombreCaso) {
  localStorage.setItem(
    'toastCasoNuevo',
    JSON.stringify({
      idAbogado,
      mensaje: `Nuevo caso asignado: "${nombreCaso}"`
    })
  );
}

export function obtenerToastCaso(idAbogado) {
  const data = JSON.parse(localStorage.getItem('toastCasoNuevo'));
  if (data && data.idAbogado === idAbogado) {
    localStorage.removeItem('toastCasoNuevo'); // eliminar una vez mostrado
    return data.mensaje;
  }
  return null;
}
