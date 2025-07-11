import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

export default function AsignarCaso() {
  const [casos, setCasos] = useState([]);
  const [abogados, setAbogados] = useState([]);
  const [idCaso, setIdCaso] = useState('');
  const [idAbogado, setIdAbogado] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerCasos();
    obtenerAbogados();
  }, []);

  const obtenerCasos = async () => {
    const res = await fetch('http://localhost:3000/api/casos');
    const data = await res.json();
    setCasos(data);
  };

  const obtenerAbogados = async () => {
    const res = await fetch('http://localhost:3000/api/abogados');
    const data = await res.json();
    setAbogados(data);
  };

  const asignarCaso = async (e) => {
    e.preventDefault();
    setMensaje('');

      const res = await fetch('http://localhost:3000/api/admin/asignar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idCasoLegal: idCaso, idAbogado }),
    });

    if (res.ok) {
      setMensaje('✅ Caso asignado correctamente');
      setIdCaso('');
      setIdAbogado('');
    } else {
      const err = await res.json();
      setMensaje(`❌ Error: ${err.message}`);
    }
  };

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4 text-blue-900">Asignar Caso a Abogado</h2>

      <form onSubmit={asignarCaso} className="space-y-4 bg-white p-6 rounded shadow max-w-xl">
        <div>
          <label className="block mb-1 font-medium">Caso Legal:</label>
          <select
            className="w-full border rounded p-2"
            value={idCaso}
            onChange={(e) => setIdCaso(e.target.value)}
            required
          >
            <option value="">Seleccione un caso</option>
            {casos.map((c) => (
              <option key={c.idCaso} value={c.idCaso}>{c.nombreCaso}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Abogado:</label>
          <select
            className="w-full border rounded p-2"
            value={idAbogado}
            onChange={(e) => setIdAbogado(e.target.value)}
            required
          >
            <option value="">Seleccione un abogado</option>
            {abogados.map((a) => (
              <option key={a.idAbogado} value={a.idAbogado}>{a.nombre}</option>
            ))}
          </select>
        </div>

        <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
          Asignar Caso
        </button>
        {mensaje && <p className="mt-2 text-sm text-green-700">{mensaje}</p>}
      </form>
    </Layout>
  );
}
