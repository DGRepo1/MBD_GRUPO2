import { useEffect, useState } from 'react';
import Toast from '../components/Toast';
import TarjetaResumen from '../components/TarjetaResumen';
import { obtenerToastCaso } from '../utils/notificaciones';
import { useNavigate } from 'react-router-dom';
import { obtenerCasosPorAbogado } from '../services/api';

export default function DashboardAbogado() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();
  const [mensajeToast, setMensajeToast] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [casos, setCasos] = useState([]);

  useEffect(() => {
  if (usuario) {
    cargarCasos(usuario.id);

    const mensaje = obtenerToastCaso(usuario.id);
    if (mensaje) setMensajeToast(mensaje);
  }
}, [usuario]);


  const cargarCasos = async (idAbogado) => {
    try {
      const data = await obtenerCasosPorAbogado(idAbogado);
      setCasos(data);
    } catch (error) {
      console.error('❌ Error al obtener casos por abogado:', error);
    }
  };

  const navegarADetalle = (id) => {
    navigate(`/caso/${id}`);
  };

  const totalAsignados = casos.length;
  const abiertos = casos.filter(c => c.estado === 'ABIERTO').length;
  const cerrados = casos.filter(c => c.estado === 'CERRADO').length;

  const casosFiltrados = casos.filter(caso => {
    if (filtroEstado === "TODOS") return true;
    return caso.estado === filtroEstado;
  });

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#002F6C]">
          Bienvenido, Dr. {usuario?.nombre}
        </h1>
        <button
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
          className="bg-[#0056A3] hover:bg-[#003f7d] text-white px-4 py-2 rounded shadow"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <TarjetaResumen titulo="Casos asignados" valor={totalAsignados} color="blue" />
        <TarjetaResumen titulo="Casos abiertos" valor={abiertos} color="green" />
        <TarjetaResumen titulo="Casos cerrados" valor={cerrados} color="gray" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#002F6C]">Casos asignados</h2>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0056A3]"
        >
          <option value="TODOS">Todos</option>
          <option value="ABIERTO">Abiertos</option>
          <option value="CERRADO">Cerrados</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#0c6cbf] text-white">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Cliente</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {casosFiltrados.map((caso, index) => (
              <tr key={caso.idCasoLegal}>
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{caso.nombre}</td>
                <td className="p-2">{caso.cliente}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    caso.estado === "ABIERTO"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {caso.estado}
                  </span>
                </td>
                <td className="p-2">{new Date(caso.fechaRegistro).toLocaleDateString()}</td>
                <td className="p-2">
                  <button
                    onClick={() => navegarADetalle(caso.idCasoLegal)}
                    className="text-[#0056A3] hover:underline"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mensajeToast && <Toast mensaje={mensajeToast} />}
    </div>
  );
}


