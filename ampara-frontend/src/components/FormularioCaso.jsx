import { useState, useEffect } from 'react';
import { obtenerClientes } from '../services/api';

export default function FormularioCaso({ onCasoCreado }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [clientes, setClientes] = useState([]);
  const [idCliente, setIdCliente] = useState('');

  useEffect(() => {
    obtenerClientes()
      .then(setClientes)
      .catch(err => console.error('❌ Error al cargar clientes:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3000/api/casos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion, idCliente })
    });
    setNombre('');
    setDescripcion('');
    setIdCliente('');
    onCasoCreado();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-4">
      <h3 className="text-lg font-bold mb-2">Registrar nuevo caso</h3>
      <input className="border p-2 w-full mb-2" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre del caso" required />
      <textarea className="border p-2 w-full mb-2" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción" required />
      <select className="border p-2 w-full mb-2" value={idCliente} onChange={e => setIdCliente(e.target.value)} required>
        <option value="">Seleccione un cliente</option>
        {clientes.map(c => <option key={c.idCliente} value={c.idCliente}>{c.nombre}</option>)}
      </select>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Registrar</button>
    </form>
  );
}
// ampara-frontend/src/components/FormularioCaso.jsx
