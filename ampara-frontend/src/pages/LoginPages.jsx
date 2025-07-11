import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });
      const data = await response.json();
      console.log("🟡 Datos recibidos del backend:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Error de autenticación');
      }

      if (!data.rol) {
         throw new Error('Faltan datos del usuario en la respuesta');
      }
      const rol = data.rol.toLowerCase();
      localStorage.setItem('usuario', JSON.stringify({ ...data, rol }));

      // Redirigir según el rol
      if (rol === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (rol === 'abogado') {
        navigate('/abogado/dashboard', { replace: true });
      } else {
        throw new Error('Rol no reconocido');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo Ampara" className="h-16" />
        </div>
        <h2 className="text-xl font-bold text-center text-blue-900 mb-4">Iniciar Sesión</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

