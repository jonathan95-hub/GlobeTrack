// Importacion de hooks y funciones de llamadas al backend necesarias

import React, { useEffect, useState } from 'react';
import { listGroup } from '../../core/services/GroupPage/listGroup';
import { enterGroupAndExitGroup } from "../../core/services/GroupPage/enterAndExitGroup";
import { useNavigate } from "react-router-dom";

const ListGroupComponent = () => {
  //Estado para guardar los grupos
  const [dataGroup, setDataGroup] = useState([]);
  //Estado para seleccionar un grupo
  const [selectedGroup, setSelectedGroup] = useState(null);
  const navigate = useNavigate();
  // Estado y modal para manejo de errores
      const [messageInfo, setMessageInfo] = useState("")
      const [modalMessageInfo, setModalMessageInfo] = useState(false)

  // Funcion para obtener los grupos
  const obtainedGroup = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token is invalid");
      navigate("/");
      return;
    }

    const group = await listGroup(); // Llamada a la funcion del backend que trae los grupos
    if (!group || !group.listGroup) return; // Si no hay grupos cortamos el codigo
    // Si si hay grupos seteamos dataGroup con el resulstado de la llamada 
    setDataGroup(group.listGroup);
  };

  // Llamada a la funcion de obtener grupos cuando se recarga el componente
  useEffect(() => {
    obtainedGroup();
  }, []);


  // Funcion para unirse o dejar un grupo
  const enterAndExitGroup = async (groupId) => { // le pasamos por parametro el id del grupo
    try {
      await enterGroupAndExitGroup(groupId); // llamada a la funcion que hace la llamada al backend pasandole el id del grupo
      setSelectedGroup(groupId); // seteamos el estado de selccionar grupo pasandole el id del grupo como parametro
      obtainedGroup(); // llamamos de nuevo a la funcion de obtener los grupos para que nos de la lista actualizada
    } catch (error) {
      console.error(error);
      setMessageInfo(error.message)
       setModalMessageInfo(true)
    }
  };
 // Funcion pra navegar hasta el chat del grupo
  const goToChat = () => {
    navigate(`/group/chat/${selectedGroup}`); 
    setSelectedGroup(null);
  };

  return (
    <div className="container-fluid my-4 px-3">
      <h3 className="text-center text-primary fw-bold mb-4">Grupos Disponibles</h3>

      {/* Contenedor flex con stretch */}
      <div className="row g-4 justify-content-center">
        {dataGroup.length > 0 ? (
          dataGroup.map((g, idx) => (
            <div
              key={idx}
              className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
            >
              <div
                className="card shadow-sm border-0 rounded-4 overflow-hidden d-flex flex-column w-100"
              >
                {g.photoGroup && (
                  <img
                    src={g.photoGroup}
                    alt={g.name}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}

                {/* Card body con flex-grow para que empuje el botón al fondo */}
                <div className="card-body d-flex flex-column flex-grow-1">
                  <h5 className="fw-bold text-primary mb-2 text-center">{g.name}</h5>

                  <p className="text-muted mb-3 text-center flex-grow-1">{g.description}</p>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center border-top pt-2">
                      <div className="d-flex flex-column text-start">
                        <small className="text-secondary fw-semibold">Miembros</small>
                        <span className="text-dark fw-medium">{g.members.length}</span>
                      </div>
                      <div className="d-flex flex-column text-end">
                        <small className="text-secondary fw-semibold">Creador</small>
                        <span className="text-dark fw-medium">{g.creatorGroup?.name}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-outline-success w-100 fw-semibold mt-auto"
                    onClick={() => enterAndExitGroup(g._id)}
                  >
                    Unirse
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted py-5">No hay grupos disponibles.</div>
        )}
      </div>

      {/* Modal */}
      {selectedGroup && (
        <div
          className="modal d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            zIndex: 9999,
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Te has unido al grupo</h5>
              </div>

              <div className="modal-body">
                <p>¿Quieres entrar al chat ahora?</p>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedGroup(null)}>
                  No
                </button>
                <button className="btn btn-primary" onClick={goToChat}>
                  Sí, entrar al chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        {modalMessageInfo && (
        <div 
          className="position-absolute top-50 start-50 translate-middle-x mt-4 p-3"
          style={{ 
            zIndex: 1100, 
            width: '90%', 
            maxWidth: '400px', 
            backgroundColor: '#ff4d4f', 
            color: '#fff',
            borderRadius: '12px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div style={{ flex: 1 }}>{messageInfo}</div>
            <button 
              className="btn-close btn-close-white"
              onClick={() => setModalMessageInfo(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListGroupComponent;
