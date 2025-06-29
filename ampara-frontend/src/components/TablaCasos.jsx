// src/components/TablaCasos.jsx
import { useState } from 'react';
import ModalAsignar from './ModalAsignar';

export default function TablaCasos({ casos, abogados }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [casoSeleccionado, setCasoSeleccionado] = useState(null);

  const abrirModal = (caso) => {
    setCasoSeleccionado(caso);
    setModalAbierto(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Cliente</th>
            <th className="p-2 text-left">Asignado</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {casos.map((caso) => (
            <tr key={caso.id} className="border-b">
              <td className="p-2">{caso.nombre}</td>
              <td className="p-2">{caso.cliente}</td>
              <td className="p-2">{caso.asignado ? "Sí" : "No"}</td>
              <td className="p-2">
                {!caso.asignado && (
                  <button
                    onClick={() => abrirModal(caso)}
                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                  >
                    Asignar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalAsignar
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        caso={casoSeleccionado}
        abogados={abogados}
      />
    </div>
  );
}
