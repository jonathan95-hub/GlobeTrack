import React, { useEffect, useState } from 'react'
import { allGroup } from '../../core/services/ControlPanel/allGroup'
import { deleteMygroup } from '../../core/services/GroupPage/deleteGroup'
import { membersGroup, expel } from '../../core/services/ControlPanel/getMemberGroup'
import { Modal } from 'react-bootstrap'

const ViewAllGroup = () => {
const [dataAllGroup, setDataAllGroup] = useState([])
const [dataMembers, setDataMembers] = useState([])
const [showModal, setShowModal] = useState(false)
const [modalTitle, setModalTitle] = useState("")
const [searchGroupTerm, setSearchGroupTerm] = useState("")
const [searchMemberTerm, setSearchMemberTerm] = useState("")
const [currentGroupId, setCurrentGroupId] = useState(null)

const getAllGroup = async () => {
try {
const res = await allGroup()
if (res && Array.isArray(res.allGroup)) {
setDataAllGroup(res.allGroup)
}
} catch (error) {
console.error(error.message)
}
}

const obatainedMembers = async (groupId, groupName) => {
  try {
    const res = await membersGroup(groupId)
    if (res && Array.isArray(res.getMembers)) {
      setDataMembers(res.getMembers)
      setModalTitle(`Miembros de ${groupName}`)
      setCurrentGroupId(groupId) // <- guardamos el groupId actual
      setSearchMemberTerm("")
      setShowModal(true)
    }
  } catch (error) {
    console.error(error.message)
  }
}

const expelMember = async(groupId, userIdToRemove) => {
    try {
         await expel(groupId, userIdToRemove)
         setDataMembers(prev => prev.filter(m => m._id !== userIdToRemove))
    } catch (error) {
        console.error(error.message)
    }
}

const deleteGroup = async (groupId) => {
try {
await deleteMygroup(groupId)
getAllGroup() // refrescar lista
} catch (error) {
console.error(error.message)
}
}

useEffect(() => {
getAllGroup()
}, [])

// Filtrado por nombre de grupo
const filteredGroups = dataAllGroup.filter(g =>
g.name.toLowerCase().includes(searchGroupTerm.toLowerCase())
)

// Filtrado de miembros dentro del modal
const filteredMembers = dataMembers.filter(m =>
m.name.toLowerCase().includes(searchMemberTerm.toLowerCase())
)

return ( <div className="container mt-4">


  {/* Buscador de grupos */}
  <div className="mb-4">
    <input
      type="text"
      className="form-control"
      placeholder="Buscar grupo por nombre..."
      value={searchGroupTerm}
      onChange={(e) => setSearchGroupTerm(e.target.value)}
    />
  </div>

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
            <button className='btn btn-success'>Ver Mensajes</button>
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
      {/* Buscador de miembros */}
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
              <button className='btn btn-danger btn-sm mt-2' onClick={() => expelMember(currentGroupId, member._id)}>Expulsar</button> 
            </div>
          ))}
        </div>
      ) : (
        <p>No hay miembros que coincidan con la búsqueda.</p>
      )}
    </Modal.Body>
  </Modal>
</div>


)
}

export default ViewAllGroup
