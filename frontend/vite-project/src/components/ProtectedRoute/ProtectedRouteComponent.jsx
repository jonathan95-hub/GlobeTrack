import React from "react";
import { Navigate } from "react-router-dom";

// Componente que protege rutas que requieren estar logueado
const ProtectedRouteComponent = ({ children }) => {

  // Se comprueba si existe el token en el localStorage.
  // Si no está, significa que el usuario no ha iniciado sesión.
  const token = localStorage.getItem("token");

  // Si no hay token, se redirige directamente a la página de inicio.
  if (!token) return <Navigate to="/" replace />;

  // Si el token existe, simplemente se renderiza el contenido de la ruta protegida.
  return children;
};

export default ProtectedRouteComponent;
