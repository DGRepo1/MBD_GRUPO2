import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function CasoAdminDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caso, setCaso] = useState(null);
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    obtenerCaso();
    obtenerComentarios();
  }, []);

  const obtenerCaso = async () => {
    const res = await fetch(`http://localhost:3000/api/casos/${id}`);
    const data = await res.json();
    setCaso(data);
  };

  const obtenerComentarios = async () => {
    const res = await fetch(`http://localhost:3000/api/casos/${id}/seguimiento`);
    const data = await res.json();
    setComentarios(data);
  };

  if (!caso) return <Layout><p>Cargando...</p></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-blue-600 mb-4 text-sm hover:underline">&larr; Volver</button>
        <h1 className="text-2xl font-bold mb-2 text-blue-900">{caso.nombre}</h1>
        <div className="bg-white p-4 shadow rounded mb-6">
          <p className="mb-1"><strong>Cliente:</strong> {caso.cliente}</p>
          <p className="mb-1"><strong>Descripción:</strong> {caso.descripcion}</p>
          <p className="mb-1"><strong>Documento:</strong> {caso.documento}</p>
        </div>

        <h2 className="text-lg font-semibold text-orange-600 mb-2">Comentarios de seguimiento</h2>
        <div className="space-y-2">
          {comentarios.length === 0 && <p className="text-sm text-gray-500">Sin comentarios</p>}
          {comentarios.map((c, idx) => (
            <div key={idx} className="bg-gray-100 p-3 rounded text-sm">
              <div className="text-gray-700"><strong>{c.autor}</strong> — {new Date(c.fecha).toLocaleDateString()}</div>
              <div>{c.comentario}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
