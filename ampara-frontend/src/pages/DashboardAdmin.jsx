// src/pages/DashboardAdmin.jsx
// src/pages/DashboardAdmin.jsx
import { useEffect, useState } from 'react';
import { obtenerCasos, obtenerAbogados } from '../services/api';
import TablaCasos from '../components/TablaCasos';
import FormularioCaso from '../components/FormularioCaso';

export default function DashboardAdmin() {
  const [casos, setCasos] = useState([]);
  const [abogados, setAbogados] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      let datosCasos = [];
      try {
        datosCasos = await obtenerCasos();
      } catch (e) {
        console.error("❌ Error en obtenerCasos:", e);
      }

      let datosAbogados = [];
      try {
        datosAbogados = await obtenerAbogados();
      } catch (e) {
        console.error("❌ Error en obtenerAbogados:", e);
      }

      let datosAsignaciones = [];
      try {
        const resAsignaciones = await fetch('http://localhost:3000/api/asignaciones');
        datosAsignaciones = await resAsignaciones.json();
      } catch (e) {
        console.error("❌ Error en obtenerAsignaciones:", e);
      }

      setCasos(datosCasos);
      setAbogados(datosAbogados);
      setAsignaciones(datosAsignaciones);
    } catch (error) {
      console.error('❌ Error general al cargar datos:', error);
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#002F6C]">Panel del Administrador</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.href = '/';
            }}
            className="bg-[#0056A3] hover:bg-[#003f7d] text-white font-semibold px-5 py-2 rounded-md transition-all duration-300 shadow-lg"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-500 shadow-md rounded-lg p-5 text-center border-l-8 border-[#0056A3]">
          <p className="text-white text-sm">Total de Casos</p>
          <p className="text-2xl font-bold text-white">{casos.length}</p>
        </div>
        <div className="bg-yellow-500 shadow-md rounded-lg p-5 text-center border-l-8 border-yellow-500">
          <p className="text-white text-sm">Casos sin Asignar</p>
          <p className="text-2xl font-bold text-white">{casos.filter(c => !c.asignado).length}</p>
        </div>
        <div className="bg-yellow-500 shadow-md rounded-lg p-5 text-center border-l-8 border-green-500">
          <p className="text-white text-sm">Total de Abogados</p>
          <p className="text-2xl font-bold text-green-600">{abogados.length}</p>
        </div>
      </div>

      <div className="mb-10">
        <FormularioCaso onCasoCreado={fetchData} />
      </div>

      <div className="mb-10">
        <TablaCasos casos={casos} abogados={abogados} asignaciones={asignaciones} />
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#002F6C] mb-4">Asignaciones Recientes</h2>
        <div className="overflow-x-auto">
          <table className="bg-[#1c1caccc] w-full table-auto text-sm text-left">
            <thead className="bg-[#0c6cbf] text-[#002F6C]">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Fecha</th>
                <th className="p-2">Cliente</th>
                <th className="p-2">Caso</th>
                <th className="p-2">Especialidad</th>
                <th className="p-2">Abogado</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.map((a, i) => (
                <tr key={i} className="border-t te hover:bg-gray-50">
                  <td className="p-2">{a.idAsignacion}</td>
                  <td className="p-2">{new Date(a.fecha).toLocaleDateString()}</td>
                  <td className="p-2">{a.cliente}</td>
                  <td className="p-2">{a.caso}</td>
                  <td className="p-2">{a.especialidad}</td>
                  <td className="p-2">{a.abogado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


