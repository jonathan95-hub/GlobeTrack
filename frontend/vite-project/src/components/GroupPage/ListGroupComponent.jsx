import React, { useEffect, useState } from 'react';
import { listGroup } from '../../core/services/GroupPage/listGroup';
import { enterGroupAndExitGroup } from "../../core/services/GroupPage/enterAndExitGroup";
import { useNavigate } from "react-router-dom";

const ListGroupComponent = () => {
  const [dataGroup, setDataGroup] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); // grupo para el modal
  const navigate = useNavigate();

  const obtainedGroup = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token is invalid");
      navigate("/");
      return;
    }

    const group = await listGroup();
    if (!group || !group.listGroup) return;

    setDataGroup(group.listGroup);
  };

  useEffect(() => {
    obtainedGroup();
  }, []);

 const enterAndExitGroup = async (groupId) => {
  try {
    const res = await enterGroupAndExitGroup(groupId);

   
      setSelectedGroup(groupId); // abre modal
    

    obtainedGroup(); // recargar lista
    
  } catch (err) {
    console.error(err);
    alert("Error al unirte al grupo");
  }
};


  // 🟢 Ir al chat
  const goToChat = () => {
    navigate(`/group/chat/${selectedGroup}`);
    setSelectedGroup(null);
  };

  return (
    <div className="container-fluid my-4 px-3">
      <h3 className="text-center text-primary fw-bold mb-4">
        Grupos Disponibles
      </h3>

      <div className="row justify-content-center g-4">
        {dataGroup.length > 0 ? (
          dataGroup.map((g, idx) => (
            <div
              key={idx}
              className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center"
            >
              <div
                className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden"
                style={{ minWidth: "250px", maxWidth: "100%" }}
              >
                {g.photoGroup && (
                  <img
                    src={g.photoGroup}
                    alt={g.name}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}

                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold text-primary mb-2 text-center">
                    {g.name}
                  </h5>

                  <p className="text-muted mb-3 text-center flex-grow-1">
                    {g.description}
                  </p>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center border-top pt-2">
                      <div className="d-flex flex-column text-start">
                        <small className="text-secondary fw-semibold">
                          Miembros
                        </small>
                        <span className="text-dark fw-medium">
                          {g.members.length}
                        </span>
                      </div>
                      <div className="d-flex flex-column text-end">
                        <small className="text-secondary fw-semibold">
                          Creador
                        </small>
                        <span className="text-dark fw-medium">
                          {g.creatorGroup.name}
                        </span>
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
          <div className="text-center text-muted py-5">
            No hay grupos disponibles.
          </div>
        )}
      </div>

      {/* 🟣 MODAL Bootstrap */}
      {selectedGroup && (
  <div
    className="modal"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedGroup(null)}
          >
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

    </div>
  );
};

export default ListGroupComponent;
