// src/pages/DashboardAdmin.jsx
import { useEffect, useState } from 'react';
import { obtenerCasos, obtenerAbogados } from '../services/api';
import TablaCasos from '../components/TablaCasos';

export default function DashboardAdmin() {
  const [casos, setCasos] = useState([]);
  const [abogados, setAbogados] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const datosCasos = await obtenerCasos();
      const datosAbogados = await obtenerAbogados();
      setCasos(datosCasos);
      setAbogados(datosAbogados);
    }
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Panel Administrador</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded">Total casos: {casos.length}</div>
        <div className="bg-yellow-100 p-4 rounded">Casos sin asignar: {casos.filter(c => !c.asignado).length}</div>
        <div className="bg-green-100 p-4 rounded">Total abogados: {abogados.length}</div>
      </div>

      <TablaCasos casos={casos} abogados={abogados} />
    </div>
  );
}


