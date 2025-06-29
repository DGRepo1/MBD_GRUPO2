// src/components/ModalAsignar.jsx
import Modal from './Modal';
import { asignarCaso } from '../services/api';

export default function ModalAsignar({ open, onClose, caso, abogados }) {
  const asignar = async (idAbogado) => {
    await asignarCaso(caso.id, idAbogado);
    onClose();
    window.location.reload(); // o emitir un evento de recarga
  };

  if (!caso) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-lg font-bold mb-3">Asignar abogado a caso</h2>
      <p className="mb-2 text-sm text-gray-600">Caso: <strong>{caso.nombre}</strong></p>

      <div className="space-y-2">
        {abogados.map((abg) => (
          <button
            key={abg.id}
            onClick={() => asignar(abg.id)}
            className="block w-full text-left bg-gray-100 px-3 py-2 rounded hover:bg-blue-100"
          >
            {abg.nombre} ({abg.correo})
          </button>
        ))}
      </div>
    </Modal>
  );
}
