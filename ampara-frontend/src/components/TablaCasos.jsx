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
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-[#F2F2F2]">
      <table className="w-full text-sm text-left text-black">
        <thead className="bg-[#002F6C] text-[#002F6C] uppercase">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Asignado</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {casos.map((caso, idx) => (
            <tr key={caso.idCaso || `${caso.nombreCaso}-${idx}`} className="border-b bg-white hover:bg-[#e6f0fa]">
              <td className="px-4 py-3">{caso.nombreCaso}</td>
              <td className="px-4 py-3">{caso.nombreCliente}</td>
              <td className="px-4 py-3">{caso.asignado ? "Sí" : "No"}</td>
              <td className="px-4 py-3 text-center space-x-2">
                {!caso.asignado && (
                  <button
                    onClick={() => abrirModal(caso)}
                    className="bg-[#0056A3] hover:bg-[#003c73] text-white px-3 py-1 rounded-md text-xs transition duration-150"
                  >
                    Asignar
                  </button>
                )}
                <button
                  onClick={async () => {
                    await fetch(`http://localhost:3000/api/casos/${caso.idCaso}`, { method: 'DELETE' });
                    window.location.reload();
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs transition duration-150"
                >
                  Eliminar
                </button>
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
