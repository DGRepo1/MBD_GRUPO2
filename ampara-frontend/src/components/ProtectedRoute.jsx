import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, rolPermitido }) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario || usuario.rol !== rolPermitido) {
    return <Navigate to="/" replace />;
  }
  return children;
}
