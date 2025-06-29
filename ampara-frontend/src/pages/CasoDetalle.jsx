import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';

export default function CasoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caso, setCaso] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [textoEditado, setTextoEditado] = useState('');

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

  const agregarComentario = async () => {
    if (!nuevoComentario.trim()) return;
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const res = await fetch(`http://localhost:3000/api/casos/${id}/seguimiento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        autor: usuario.nombre,
        comentario: nuevoComentario
      }),
    });

    if (res.ok) {
      setNuevoComentario('');
      setMensaje('Comentario agregado');
      obtenerComentarios();
      setTimeout(() => setMensaje(''), 2000);
    }
  };

  const abrirModalEdicion = (comentario) => {
    setComentarioSeleccionado(comentario);
    setTextoEditado(comentario.comentario);
    setModalAbierto(true);
  };

  const guardarEdicion = async () => {
    if (!comentarioSeleccionado) return;

    const res = await fetch(`http://localhost:3000/api/casos/${id}/seguimiento/${comentarioSeleccionado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comentario: textoEditado })
    });

    if (res.ok) {
      setModalAbierto(false);
      obtenerComentarios();
    }
  };

  const formatoFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-PE');
  };

  if (!caso) return <Layout><p className="text-gray-500">Cargando caso...</p></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="text-sm text-blue-600 mb-4 hover:underline">&larr; Volver</button>

        <h1 className="text-2xl font-bold text-blue-900 mb-2">{caso.nombre}</h1>
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <p className="text-gray-700 mb-1"><strong>Cliente:</strong> {caso.cliente}</p>
          <p className="text-gray-700 mb-1"><strong>Documento:</strong> {caso.documento || "No especificado"}</p>
          <p className="text-gray-700"><strong>Descripción:</strong> {caso.descripcion}</p>
        </div>

        <h2 className="text-lg font-semibold text-orange-600 mb-2">Seguimiento del caso</h2>

        <div className="space-y-3 mb-6">
          {comentarios.length === 0 && <p className="text-sm text-gray-500">Sin comentarios aún</p>}
          {comentarios.map((com, idx) => (
            <div key={idx} className="bg-gray-50 border rounded p-3 shadow-sm relative">
              <div className="text-sm text-gray-600 mb-1 flex justify-between">
                <span><strong>{com.autor}</strong> — {formatoFecha(com.fecha)}</span>
                <button
                  onClick={() => abrirModalEdicion(com)}
                  className="text-blue-600 hover:underline text-xs"
                >
                  Editar
                </button>
              </div>
              <div className="text-sm text-gray-800">{com.comentario}</div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-orange-300"
            placeholder="Escribe un nuevo comentario..."
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
          />
          <button
            onClick={agregarComentario}
            className="mt-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Agregar comentario
          </button>
          {mensaje && <p className="text-green-600 text-sm mt-2">{mensaje}</p>}
        </div>
      </div>

      {/* Modal para edición de comentario */}
      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)}>
        <h2 className="text-lg font-bold mb-2">Editar comentario</h2>
        <textarea
          rows={4}
          className="w-full border rounded p-2"
          value={textoEditado}
          onChange={(e) => setTextoEditado(e.target.value)}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={guardarEdicion} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Guardar
          </button>
          <button onClick={() => setModalAbierto(false)} className="text-gray-600 hover:underline">
            Cancelar
          </button>
        </div>
      </Modal>
    </Layout>
  );
}
