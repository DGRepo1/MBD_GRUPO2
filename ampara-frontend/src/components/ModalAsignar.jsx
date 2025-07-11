// src/components/ModalAsignar.jsx
import Modal from './Modal';
import { asignarCaso } from '../services/api';

export default function ModalAsignar({ open, onClose, caso, abogados, asignaciones = [] }) {
  const asignar = async (idAbogado) => {
    const yaAsignado = asignaciones.some(
      (a) => a.idCaso === caso.idCaso && a.idAbogado === idAbogado
    );

    if (yaAsignado) {
      alert("⚠️ Este caso ya fue asignado a este abogado.");
      return;
    }

    try {
      await asignarCaso(caso.idCaso, idAbogado);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("❌ Error al asignar caso:", error.message);
      alert("Error: " + error.message);
    }
  };

  if (!caso) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-lg font-bold mb-3">Asignar abogado a caso</h2>
      <p className="mb-2 text-sm text-gray-600">Caso: <strong>{caso.nombreCaso}</strong></p>

      <div className="space-y-2">
        {abogados.length === 0 ? (
          <p className="text-sm text-red-500">No hay abogados disponibles.</p>
        ) : (
          abogados.map((abg) => (
            <button
              key={abg.idAbogado}
              onClick={() => asignar(abg.idAbogado)}
              className="block w-full text-left bg-gray-100 px-3 py-2 rounded hover:bg-blue-100"
            >
              {abg.nombre} {abg.correo && `(${abg.correo})`}
            </button>
          ))
        )}
      </div>
    </Modal>
  );
}
