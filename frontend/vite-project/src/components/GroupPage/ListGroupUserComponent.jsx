// Importacion de hooks y funciones necesarias
import React, { useEffect, useState } from "react";
import { listGroupIncludesUser } from "../../core/services/GroupPage/listGroup";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { deleteMygroup } from "../../core/services/GroupPage/deleteGroup";
import { enterGroupAndExitGroup } from "../../core/services/GroupPage/enterAndExitGroup";

const ListGroupUserComponent = () => {
  // Estado donde se guardan los grupos 
  const [myGroups, setMyGroups] = useState([]);
  const navigate = useNavigate();
  // Estado para abrir o cerrar modal
  const [showModal, setShowModal] = useState(false);
    // Estado para abrir o cerrar modal de dejar grupo 
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  // Estado donde guardamos el ID del grupo que queremos eliminar
  const [groupToDelete, setGroupToDelete] = useState(null);

  const [groupToLeave, setGroupToLeave] = useState(null);
 // Estado donde guardamos el ID del grupo que queremos dejar
  const user = useSelector(state => state.loginReducer); // usuario actual

  //Fucion de mi lista de grupos
  const myList = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { // Si no hay toquen mandamos a la landinPage
        alert("Token invalid");
        navigate("/");
        return;
      }

      const myGroup = await listGroupIncludesUser(); // llamada  a la funcion del backend que trae los grupos del usuario
      const groupsData = myGroup.listGroup || myGroup.groups || [];
      setMyGroups(groupsData); // setemos el Estado de mis grupos con groupData

    } catch (err) {
      console.error("Error en myList:", err);
      setMyGroups([]);
    }
  };

   // Función para entrar o salir de un grupo
  const enterAndExitGroupFn = async (groupId) => {
    try {
      const res = await enterGroupAndExitGroup(groupId);
       // Si el backend dice que salimos del grupo, lo quitamos del estado
      if (res.left) setMyGroups(prev => prev.filter(g => g._id !== groupId));
      // Llamamos de nuevo a la lista de mis grupos para traerla actualizada
      myList();
    } catch (err) {
      console.error(err);
      alert("Error al unirte o salir del grupo");
    }
  };

  
  // Confirmación final para dejar grupo (llamamos a la función principal)
  const confirmLeaveGroup = () => {
    enterAndExitGroupFn(groupToLeave);
    setShowLeaveModal(false);
    setGroupToLeave(null);
  };

   // Abrimos el modal de salir del grupo pasandole como parametro el id del grupo
  const openLeaveModal = (groupId) => {
    setGroupToLeave(groupId);
    setShowLeaveModal(true);
  };

   // Función que elimina el grupo si somos el creador del grupo
  const deleteGroup = async () => {
    try {
      await deleteMygroup(groupToDelete);
      setMyGroups(prev => prev.filter(g => g._id !== groupToDelete));
      setShowModal(false);
      setGroupToDelete(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al eliminar el grupo");
    }
  };
// Abrimos el modal para eliminar el grupo
  const openDeleteModal = (groupId) => {
    setGroupToDelete(groupId);
    setShowModal(true);
  };
  // Navegamos a crear grupo
  const goToCreate = () => navigate("/group/create");

  // cargamos mis grupos cada vez que entramos a la pagina
  useEffect(() => { myList(); }, []);

  return (
    <div className="container-fluid my-4 px-3">
      <div className='mb-3 mt-3 d-flex justify-content-center'>
        <button className='btn btn-warning' onClick={goToCreate}>Crear grupo</button>
      </div>

      <h3 className="text-center mb-4">Mis Grupos</h3>

      <div className="row justify-content-center g-4">
        {myGroups.length === 0 ? (
          <div className="text-center text-muted py-5">No perteneces a ningún grupo aún.</div>
        ) : (
          myGroups.map((g, idx) => (
            <div 
              key={idx} 
              className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
            >
              <div className="card shadow-sm d-flex flex-column w-100" style={{ minWidth: "250px" }}>
                {g.photoGroup && (
                  <img
                    src={g.photoGroup}
                    alt={g.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}

                <div className="card-body d-flex flex-column flex-grow-1">
                  <h5 className="card-title">{g.name}</h5>
                  <p className="card-text text-muted mb-2 flex-grow-1">{g.description}</p>

                  <div className="mb-2 d-flex justify-content-between">
                    <small className="text-secondary">
                      Miembros: {g.members?.length || 0}
                    </small>
                    <small className="text-secondary">
                      Creador: {g.creatorGroup?.name || "Desconocido"}
                    </small>
                  </div>

                  <div className="mt-auto d-flex flex-column gap-2">
                    <button 
                      className="btn btn-primary w-100" 
                      onClick={() => navigate(`/group/chat/${g._id}`)}
                    >
                      Entrar al chat
                    </button>

                    {g.creatorGroup?._id === user?.user?._id ? (
                      <div className="d-flex gap-2 flex-column">
                        <button 
                          className="btn btn-warning w-100"
                          onClick={() => navigate("/group/create", { state: { group: g } })}
                        >
                          Editar grupo
                        </button>
                        <button 
                          className="btn btn-danger w-100" 
                          onClick={() => openDeleteModal(g._id)}
                        >
                          Eliminar grupo
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-danger w-100" 
                        onClick={() => openLeaveModal(g._id)}  
                      >
                        Dejar grupo
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL ELIMINAR GRUPO */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger fw-bold">Eliminar Grupo</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que quieres eliminar este grupo? Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={deleteGroup}>Sí, eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DEJAR GRUPO */}
      {showLeaveModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-warning fw-bold">Salir del grupo</h5>
                <button type="button" className="btn-close" onClick={() => setShowLeaveModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que quieres dejar este grupo?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLeaveModal(false)}>No</button>
                <button type="button" className="btn btn-danger" onClick={confirmLeaveGroup}>Sí, salir</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ListGroupUserComponent;
