// Importamos React y algunos hooks que voy a usar en el componente
import React, { use, useEffect, useState } from 'react'
// Importamos el servicio que me trae todos los grupos
import { allGroup } from '../../core/services/ControlPanel/allGroup'
// Importamos el servicio para eliminar un grupo
import { deleteMygroup } from '../../core/services/GroupPage/deleteGroup'
// Importamos los servicios para obtener los miembros de un grupo y expulsar a uno
import { membersGroup, expel } from '../../core/services/ControlPanel/getMemberGroup'
// Importamos el servicio que trae los mensajes del grupo
import { getMessageGroup } from '../../core/services/GroupPage/messagesGroup'
// Importamos el modal de bootstrap para las ventanas emergentes
import { Modal } from 'react-bootstrap'


const ViewAllGroup = () => {

  // Estado donde guardamos todos los grupos
  const [dataAllGroup, setDataAllGroup] = useState([])

  // Estado para guardar los miembros cuando se abre un grupo
  const [dataMembers, setDataMembers] = useState([])

  // Estado para guardar los mensajes del grupo seleccionado
  const [dataMessages, setDataMessages] = useState([])

  // Estado para mostrar o esconder el modal de miembros
  const [showModal, setShowModal] = useState(false)

  // Título que aparecerá en el modal de miembros
  const [modalTitle, setModalTitle] = useState("")

  // Estado para buscar grupos por nombre
  const [searchGroupTerm, setSearchGroupTerm] = useState("")

  // Estado para buscar miembros dentro del modal
  const [searchMemberTerm, setSearchMemberTerm] = useState("")

  // Guardo el id del grupo actual para poder expulsar miembros correctamente
  const [currentGroupId, setCurrentGroupId] = useState(null)

  // Estado para mostrar el modal de mensajes
  const [modalMessage, setModalMessage] = useState(false)

  // Guardar la fecha que se usa en el filtro de mensajes
  const [searchDate, setSearchDate] = useState("")

  // Funcion que trae todos los grupos
  const getAllGroup = async () => {
    try {
      const res = await allGroup()
      // Si la respuesta trae el array de grupos, se guarda en el estado
      if (res && Array.isArray(res.allGroup)) {
        setDataAllGroup(res.allGroup)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  // Función que trae los miembros de un grupo
  const obatainedMembers = async (groupId, groupName) => {
    try {
      const res = await membersGroup(groupId)
      // Si la respuesta tiene la lista de miembros, la guardo
      if (res && Array.isArray(res.getMembers)) {
        setDataMembers(res.getMembers)
        // Poner el título del modal usando el nombre del grupo
        setModalTitle(`Miembros de ${groupName}`)
        // Guardo el ID del grupo que estoy viendo
        setCurrentGroupId(groupId)
        // Limpiar el buscador de miembros
        setSearchMemberTerm("")
        // Abrir el modal
        setShowModal(true)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  // Función que trae los mensajes del grupo
  const obtainMessages = async (groupId) => {
    try {
      const res = await getMessageGroup(groupId)
      // Si hay mensajes los guardo
      if (res && Array.isArray(res.messages)) {
        setDataMessages(res.messages)
      }
      // si no saldra un array vacío
       else {
        setDataMessages([])
      }
      // aparece el modal de mensajes
      setModalMessage(true)
    } catch (err) {
      console.error("Error cargando mensajes:", err)
      alert("Error cargando mensajes")
    }
  }

  // Expulsar miembro del grupo
  const expelMember = async(groupId, userIdToRemove) => {
    try {
      // Llamo a la funcion que lo expulsa
      await expel(groupId, userIdToRemove)
      // Lo quitamos del estado para que desaparezca en tiempo real
      setDataMembers(prev => prev.filter(m => m._id !== userIdToRemove))
    } catch (error) {
      console.error(error.message)
    }
  }

  // Función que elimina un grupo
  const deleteGroup = async (groupId) => {
    try {
      await deleteMygroup(groupId)
      // llamamos de la funcion de todos los grupos para obtener la lista actualizada
      getAllGroup()
    } catch (error) {
      console.error(error.message)
    }
  }

  // Filtro para las fechas de mensajes
  const filteredMessages = dataMessages.filter(m => {
    if (!searchDate) return true
    const createdAt = new Date(m.createdAt)
    const formatted = `${createdAt.getFullYear()}-${String(createdAt.getMonth()+1).padStart(2,'0')}-${String(createdAt.getDate()).padStart(2,'0')}`
    return formatted === searchDate
  })

  // Cuando carga el componente por primera vez trae todos los grupos
  useEffect(() => {
    getAllGroup()
  }, [])

  // Filtro para buscar grupos por nombre
  const filteredGroups = dataAllGroup.filter(g =>
    g.name.toLowerCase().includes(searchGroupTerm.toLowerCase())
  )

  // Filtro para buscar miembros dentro del modal
  const filteredMembers = dataMembers.filter(m =>
    m.name.toLowerCase().includes(searchMemberTerm.toLowerCase())
  )


  return (
    <div className="container mt-4">

      {/*  Este es el buscador de grupos */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar grupo por nombre..."
          value={searchGroupTerm}
          onChange={(e) => setSearchGroupTerm(e.target.value)}
        />
      </div>

      {/*todos los grupos ordenados en con grid */}
      <div className="row g-4">
        {filteredGroups.map((g, idx) => (
          <div className="col-12 col-md-6 col-lg-4" key={idx}>
            <div className="card shadow-sm h-100">
              <img
                src={g.photoGroup}
                alt={g.name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />

              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title text-primary fw-bold">{g.name}</h5>

                <div className='d-flex gap-2'>
                  <span className='fw-bold'>Creado por:</span>
                  <span className='text-success fw-bold'>{g.creatorGroup?.name}</span>
                </div>
              </div>

              <div className='d-flex flex-column gap-1 p-3'>
                <button
                  className='btn btn-success'
                  onClick={() => obatainedMembers(g._id, g.name)}
                >
                  Ver Miembros
                </button>

                <button 
                  className='btn btn-success'
                  onClick={() => obtainMessages(g._id)}
                >
                  Ver Mensajes
                </button>

                <button
                  className='btn btn-danger'
                  onClick={() => deleteGroup(g._id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de miembros */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* este es el buscador de miembros */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar miembro por nombre..."
              value={searchMemberTerm}
              onChange={(e) => setSearchMemberTerm(e.target.value)}
            />
          </div>

          {filteredMembers.length > 0 ? (
            <div className="d-flex flex-wrap gap-3 justify-content-start">
              {filteredMembers.map(member => (
                <div 
                  key={member._id} 
                  className="d-flex flex-column align-items-center p-2 border rounded"
                  style={{ width: "120px" }}
                >
                  <img
                    src={member.photoProfile}
                    alt={member.name}
                    style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }}
                  />

                  <span className="fw-semibold text-center mt-2">{member.name}</span>

                  <button 
                    className='btn btn-danger btn-sm mt-2' 
                    onClick={() => expelMember(currentGroupId, member._id)}
                  >
                    Expulsar
                  </button> 
                </div>
              ))}
            </div>
          ) : (
            <p>No hay miembros que coincidan con la búsqueda.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal de mensajes */}
      <Modal show={modalMessage} onHide={() => setModalMessage(false)} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Mensajes</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          {/* Buscador por fecha */}
          <div className="mb-3">
            <input
              type="date"
              className="form-control"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>

          {filteredMessages.length > 0 ? (
            <div className="d-flex flex-column gap-3" style={{ maxHeight: "400px", overflowY: "auto" }}>

              {filteredMessages.map((m, idx) => {

                // Con esto se cambia el orden de la fecha para que se dia\mes\año
                const createdAt = new Date(m.createdAt)
                const formattedDate = `${String(createdAt.getDate()).padStart(2,'0')}/${String(createdAt.getMonth()+1).padStart(2,'0')}/${createdAt.getFullYear()}`
                const formattedTime = `${String(createdAt.getHours()).padStart(2,'0')}:${String(createdAt.getMinutes()).padStart(2,'0')}`

                return (
                  <div
                    key={idx}
                    className="d-flex flex-column p-2 border rounded"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >

                    {/* Imagen del usuario más el nombre */}
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <img
                        src={m.sender?.photoProfile || "https://via.placeholder.com/40"}
                        alt={m.sender?.name || "Usuario"}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <span className="fw-bold">{m.sender?.name || "Usuario desconocido"}</span>
                    </div>

                    {/* Contenido del mensaje */}
                    <div style={{ marginLeft: 42 }}>
                      {m.content || "Sin contenido"}
                    </div>

                    {/* Fecha y hora */}
                    <div style={{ marginLeft: 42, textAlign: "right", fontSize: "0.8rem", color: "#666" }}>
                      {formattedDate} {formattedTime}
                    </div>

                  </div>
                )
              })}

            </div>
          ) : (
            <p>No hay mensajes para mostrar.</p>
          )}

        </Modal.Body>
      </Modal>

    </div>
  )
}

export default ViewAllGroup
