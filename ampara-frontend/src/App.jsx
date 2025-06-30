// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPages.jsx';
import DashboardAdmin from './pages/DashboardAdmin.jsx';
import Abogados from './pages/Abogados.jsx';
import CasoAdminDetalle from './pages/CasoAdminDetalle.jsx';
import DashboardAbogado from './pages/DashboardAbogado.jsx';
import CasoDetalle from './pages/CasoDetalle.jsx';
import AsignarCaso from './pages/AsignarCaso.jsx';

export default function App() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const RutaProtegida = ({ children, rol }) => {
    if (!usuario) return <Navigate to="/" />;
    if (rol && usuario.rol !== rol) return <Navigate to="/" />;
    return children;
  };

  return (
    <Routes>
      {/* Login público */}
      <Route path="/" element={<Login />} />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={<RutaProtegida rol="admin"><DashboardAdmin /></RutaProtegida>}
      />
      <Route
        path="/admin/abogados"
        element={<RutaProtegida rol="admin"><Abogados /></RutaProtegida>}
      />
      <Route
        path="/admin/casos/:id"
        element={<RutaProtegida rol="admin"><CasoAdminDetalle /></RutaProtegida>}
      />
      <Route
        path="/asignar"
        element={usuario?.rol === 'ADMIN' ? <AsignarCaso /> : <Navigate to="/dashboard" />}
      />


      {/* Abogado */}
      <Route
        path="/abogado/dashboard"
        element={<RutaProtegida rol="abogado"><DashboardAbogado /></RutaProtegida>}
      />
      <Route
        path="/abogado/casos/:id"
        element={<RutaProtegida rol="abogado"><CasoDetalle /></RutaProtegida>}
      />
    </Routes>
  );
}


