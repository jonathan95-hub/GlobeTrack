import React, { useEffect, useState } from 'react'
import { allUser } from '../../core/services/ControlPanel/AllUser'
import { deleteUser } from '../../core/services/ControlPanel/deleteUser'

const ViewAllUser = () => {
const [dataUser, setDataUser] = useState([])
const [showModal, setShowModal] = useState(false)
const [selectedUser, setSelectedUser] = useState(null)
const [searchTerm, setSearchTerm] = useState("")

const getAllUser = async () => {
try {
const res = await allUser()
if (res && Array.isArray(res.users)) {
setDataUser(res.users)
}
} catch (error) {
console.error(error.message)
}
}

const handleBanClick = (user) => {
setSelectedUser(user)
setShowModal(true)
}

const handleDetailClick = (user) => {
setSelectedUser(user)
setShowModal(true)
}

const confirmBan = async () => {
if (selectedUser) {
try {
await deleteUser(selectedUser._id)
setShowModal(false)
setSelectedUser(null)
getAllUser()
} catch (error) {
console.error(error.message)
}
}
}

useEffect(() => {
getAllUser()
}, [])

const formatDate = (isoDate) => {
if (!isoDate) return ''
const date = new Date(isoDate)
const day = String(date.getDate()).padStart(2, '0')
const month = String(date.getMonth() + 1).padStart(2, '0')
const year = date.getFullYear()
return `${day}/${month}/${year}`
}

const filteredUsers = dataUser.filter(u =>
(`${u.name} ${u.lastName}`).toLowerCase().includes(searchTerm.toLowerCase())
)

return ( <div className="container mt-3"> <div className="mb-4">
<input
type="text"
className="form-control"
placeholder="Buscar usuario por nombre..."
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
/> </div>

  <div className="d-flex flex-column gap-3">
    {filteredUsers.map((u, idx) => (
      <div
        key={idx}
        className="card shadow-sm p-3 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3"
      >
        {/* ROL */}
        <div className="text-center text-md-start" style={{ minWidth: '90px' }}>
          <span className="text-secondary fw-semibold d-block">Rol:</span>
          <span className="fw-bold" style={{ color: '#0d6efd' }}>
            {u.isAdmin}
          </span>
        </div>

        {/* FOTO */}
        <div className="text-center" style={{ minWidth: '90px' }}>
          <img
            src={u.photoProfile}
            alt="Foto de perfil"
            className="rounded-circle"
            style={{ width: '70px', height: '70px', objectFit: 'cover', border: '3px solid #eee' }}
          />
        </div>

        {/* NOMBRE */}
        <div
          className="fw-bold text-dark text-center text-md-start flex-grow-1"
          style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {u.name} {u.lastName}
        </div>

        {/* ESTADÍSTICAS */}
        <div className="d-flex flex-column text-center text-md-start" style={{ minWidth: '220px' }}>
          <div className="d-flex justify-content-center justify-content-md-start gap-2">
            <span className="fw-semibold text-secondary">Seguidores:</span>
            <span className="fw-bold">{u.followers.length}</span>
          </div>
          <div className="d-flex justify-content-center justify-content-md-start gap-2">
            <span className="fw-semibold text-secondary">Seguidos:</span>
            <span className="fw-bold">{u.following.length}</span>
          </div>
          <div className="d-flex justify-content-center justify-content-md-start gap-2">
            <span className="fw-semibold text-secondary">Registrado:</span>
            <span className="fw-bold">{formatDate(u.createdAt)}</span>
          </div>
          <div className="d-flex justify-content-center justify-content-md-start gap-2">
            <span className="fw-semibold text-secondary">Posts:</span>
            <span className="fw-bold">{u.post.length}</span>
          </div>
        </div>

        {/* BOTONES */}
        <div className="d-flex flex-column gap-2 text-center text-md-end" style={{ minWidth: '130px' }}>
          <button className="btn btn-danger btn-sm w-100" onClick={() => handleBanClick(u)}>Banear</button>
          <button className="btn btn-success btn-sm w-100" onClick={() => handleDetailClick(u)}>Detalle</button>
        </div>
      </div>
    ))}

    {showModal && selectedUser && (
      <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Detalle de {selectedUser.name} {selectedUser.lastName}</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-4 text-center mb-3">
                  <img
                    src={selectedUser.photoProfile}
                    alt="Foto de perfil"
                    className="rounded-circle"
                    style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid #eee' }}
                  />
                </div>
                <div className="col-md-8">
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Rol:</strong> {selectedUser.isAdmin}</p>
                  <p><strong>Biografía:</strong> {selectedUser.biography || 'No disponible'}</p>
                  <p><strong>País:</strong> {selectedUser.country || 'No disponible'}</p>
                  <p><strong>Ciudad:</strong> {selectedUser.city || 'No disponible'}</p>
                  <p><strong>Fecha de nacimiento:</strong> {formatDate(selectedUser.birthDate)}</p>
                  <p><strong>Seguidores:</strong> {selectedUser.followers.length}</p>
                  <p><strong>Seguidos:</strong> {selectedUser.following.length}</p>
                  <p><strong>Posts:</strong> {selectedUser.post.length}</p>
                  <p><strong>Destinos visitados:</strong> {selectedUser.visitedDestinations.length}</p>
                  <p><strong>Destinos deseados:</strong> {selectedUser.desiredDestinations.length}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {selectedUser && selectedUser._id && (
                <button type="button" className="btn btn-danger" onClick={confirmBan}>Banear</button>
              )}
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</div>


)
}

export default ViewAllUser
