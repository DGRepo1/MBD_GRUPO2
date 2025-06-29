import { useEffect, useState } from 'react';
import Toast from '../components/Toast';
import TarjetaResumen from '../components/TarjetaResumen';
import { obtenerToastCaso } from '../utils/notificaciones';
import { useNavigate } from 'react-router-dom';

export default function DashboardAbogado() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();
  const [mensajeToast, setMensajeToast] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");

  const [casos, setCasos] = useState([
    {
      id: 1,
      nombre: "Caso Interrupción de Servicio",
      cliente: "Claro Perú",
      estado: "ABIERTO",
      fecha: "2024-10-01"
    },
    {
      id: 2,
      nombre: "Caso Regulación Tarifaria",
      cliente: "Movistar",
      estado: "CERRADO",
      fecha: "2024-08-20"
    },
    {
      id: 3,
      nombre: "Caso de Publicidad Engañosa",
      cliente: "Entel",
      estado: "ABIERTO",
      fecha: "2025-01-15"
    }
  ]);

  const totalAsignados = casos.length;
  const abiertos = casos.filter(c => c.estado === 'ABIERTO').length;
  const cerrados = casos.filter(c => c.estado === 'CERRADO').length;

  const casosFiltrados = casos.filter(caso => {
    if (filtroEstado === "TODOS") return true;
    return caso.estado === filtroEstado;
  });

  useEffect(() => {
    if (usuario?.rol === 'ABOGADO') {
      const mensaje = obtenerToastCaso(usuario.id);
      if (mensaje) setMensajeToast(mensaje);
    }
  }, [usuario]);

  const navegarADetalle = (id) => {
    navigate(`/caso/${id}`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">
        Bienvenido, Dr. {usuario?.nombre}
      </h1>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TarjetaResumen titulo="Casos asignados" valor={totalAsignados} color="blue" />
        <TarjetaResumen titulo="Casos abiertos" valor={abiertos} color="green" />
        <TarjetaResumen titulo="Casos cerrados" valor={cerrados} color="gray" />
      </div>

      {/* Filtro por estado */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Casos asignados</h2>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="TODOS">Todos</option>
          <option value="ABIERTO">Abiertos</option>
          <option value="CERRADO">Cerrados</option>
        </select>
      </div>

      {/* Tabla de casos */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white text-sm">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Cliente</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Acción</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm divide-y divide-gray-200">
            {casosFiltrados.map((caso, index) => (
              <tr key={caso.id}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{caso.nombre}</td>
                <td className="px-4 py-2">{caso.cliente}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    caso.estado === "ABIERTO"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {caso.estado}
                  </span>
                </td>
                <td className="px-4 py-2">{caso.fecha}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => navegarADetalle(caso.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toast visual si se asigna un nuevo caso */}
      {mensajeToast && <Toast mensaje={mensajeToast} />}
    </div>
  );
}
