import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import Layout from '../components/Layout';

export default function MisSeguimientos() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const [seguimientos, setSeguimientos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [comentarioEditado, setComentarioEditado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerSeguimientos();
  }, []);

  const obtenerSeguimientos = async () => {
    const res = await fetch(`http://localhost:3000/api/abogados/${usuario.id}/seguimientos`);
    const data = await res.json();
    setSeguimientos(data);
  };

  const guardarEdicion = async (idSeguimiento) => {
    if (!comentarioEditado.trim()) return setError('El comentario no puede estar vacío');
    if (comentarioEditado.length > 500) return setError('Máximo 500 caracteres');

    const res = await fetch(`http://localhost:3000/api/seguimiento/${idSeguimiento}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comentario: comentarioEditado })
    });

    if (res.ok) {
      setMensaje('Comentario actualizado');
      setEditando(null);
      setComentarioEditado('');
      setError('');
      obtenerSeguimientos();
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Mis Seguimientos</h1>

      {mensaje && <div className="text-green-600 mb-3">{mensaje}</div>}
      {error && <div className="text-red-600 mb-3">{error}</div>}

      <div className="space-y-4">
        {seguimientos.map((seg) => (
          <div key={seg.id} className="bg-white p-4 rounded shadow border relative">
            <div className="text-sm text-gray-600 mb-1">
              <strong>{seg.nombreCaso}</strong> — {seg.cliente} — {seg.fecha}
            </div>
            <p className="text-sm">{seg.comentario}</p>
            <button
              onClick={() => {
                setEditando(seg);
                setComentarioEditado(seg.comentario);
              }}
              className="absolute top-3 right-4 text-blue-600 text-sm"
            >
              Editar
            </button>
          </div>
        ))}
      </div>

      {/* Modal para editar */}
      <Modal open={!!editando} onClose={() => setEditando(null)}>
        <h2 className="text-lg font-semibold mb-2 text-blue-800">Editar comentario</h2>
        <textarea
          rows={4}
          className="w-full border rounded p-2 mb-3"
          value={comentarioEditado}
          onChange={(e) => setComentarioEditado(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setEditando(null)}
            className="bg-gray-300 px-4 py-2 rounded"
          >Cancelar</button>
          <button
            onClick={() => guardarEdicion(editando.id)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >Guardar</button>
        </div>
      </Modal>
    </Layout>
  );
}
