import React, { useState } from "react";
// Componentes para mostrar grupos generales y grupos del usuario
import ListGroupComponent from "../../components/GroupPage/ListGroupComponent";
import ListGroupUserComponent from "../../components/GroupPage/ListGroupUserComponent";

const GroupPage = () => {
  // Estado para determinar si se muestran "Mis Grupos" o "Grupos Disponibles"
  const [isMyGroup, setIsMyGroup] = useState(false);
  // Estado auxiliar para controlar qué botón mostrar
  const [whatAView, setWhatAView] = useState(false)

  // Función que activa la vista de "Mis Grupos"
  const chageMygroups = () => {
    setIsMyGroup(true)
    setWhatAView(true) // Cambia el botón a "Ir a Grupos Disponibles"
  }

  // Función que activa la vista de "Grupos Disponibles"
  const availableGroups = () => {
    setIsMyGroup(false)
    setWhatAView(false) // Cambia el botón a "Ir a Mis Grupos"
  }

  return (
    <div>
      {/* Título de la página */}
      <h2 className="text-center mb-5 mt-5 fw-bold"> Explora grupos</h2>

      {/* Botón que cambia entre "Mis Grupos" y "Grupos Disponibles" */}
      <div className="d-flex justify-content-center gap-3">
        {whatAView ? (
          <div>
            <button className="btn btn-primary" onClick={availableGroups}>
              Ir a Grupos Disponibles
            </button>
          </div>
        ) : (
          <div>
            <button className="btn btn-success" onClick={chageMygroups}>
              Ir a Mis Grupos
            </button>
          </div>
        )}
      </div>

      {/* Renderizado condicional de los componentes según la vista seleccionada */}
      {isMyGroup ? (
        <ListGroupUserComponent />  // Muestra los grupos del usuario
      ) : (
        <ListGroupComponent />      // Muestra los grupos disponibles
      )}
    </div>
  );
};

export default GroupPage;
