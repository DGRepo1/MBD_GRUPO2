import { useEffect, useState } from 'react';
import { obtenerAbogados } from '../services/api';
import Layout from '../components/Layout';

export default function Abogados() {
  const [abogados, setAbogados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await obtenerAbogados();
      setAbogados(data);
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Abogados registrados</h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Correo</th>
            </tr>
          </thead>
          <tbody>
            {abogados.map((abg) => (
              <tr key={abg.id} className="border-b">
                <td className="p-2">{abg.id}</td>
                <td className="p-2">{abg.nombre}</td>
                <td className="p-2">{abg.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
