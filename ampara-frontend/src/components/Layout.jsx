import { useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario')); // <-- Obtenemos al usuario

  const logout = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Ampara Legal</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:inline">👤 {usuario?.nombre}</span>
          <button
            onClick={logout}
            className="text-sm underline hover:text-orange-300"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="p-6 flex-1">
        {children}
      </main>
    </div>
  );
}

