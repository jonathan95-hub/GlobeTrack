// Importamos useEffect y useState de react
import React, { useEffect, useState } from 'react'
// Importamos la funcion que hace la llamada al backend para traer todos los usuarios
import { allUser } from '../../core/services/ControlPanel/AllUser'
// Importamos la función que hace la llamada al backend para eliminar un usuario
import { deleteUser } from '../../core/services/ControlPanel/deleteUser'

const ViewAllUser = () => {
  // Estado y modal para manejo de errores
       const [messageInfo, setMessageInfo] = useState("")
       const [modalMessageInfo, setModalMessageInfo] = useState(false)
  // Estado donde guardamos los usuarios
const [dataUser, setDataUser] = useState([])
// Estado para mostrar un modal
const [showModal, setShowModal] = useState(false)
// Estado donde guardamos el usuario seleccionad
const [selectedUser, setSelectedUser] = useState(null)
// Estado para buscar a los usuarios
const [searchTerm, setSearchTerm] = useState("")

// Función para traer todos los usuarios
const getAllUser = async () => {
try {
const res = await allUser() // Llamada a la funcion que llama al backend
if (res && Array.isArray(res.users)) { // si vienen en un array 
setDataUser(res.users) // seteamos  el  estado dataUser con res.users
}
} catch (error) {
console.error(error.message)
   setMessageInfo(error.message)
      setModalMessageInfo(true)
}
}

//Funcion para cuando le damos click a banear 
// Le paasamos por parametro el usuario
const handleBanClick = (user) => {
setSelectedUser(user) // seteamos selectedUser con el usuario
setShowModal(true) // ponemos el modal en true
}
 // Función para cuando hacemos click en detalles
 // Le paasamos por parametro el usuario
const handleDetailClick = (user) => {
setSelectedUser(user) // seteamos selectedUser con el usuario
setShowModal(true) // ponemos el modal en true
}

// Función para eliminar el usuario
const confirmBan = async () => {
if (selectedUser) { // le pasamos el usuario seleccionado
try {
await deleteUser(selectedUser._id) // llamamos a la función que hace la llamada al backend para eliminar usuario y en el parametro le pasamos el id del usuario seleccionado
setShowModal(false) // cerramos el modal
setSelectedUser(null) // ponemos el usuario seleccionado en nulo
getAllUser() // llamamos a la función que traer todos los usuarios para obtener la lista actualiza 
} catch (error) {
console.error(error.message)
   setMessageInfo(error.message)
      setModalMessageInfo(true)
}
}
}
 // Usamos useEffect para llamar a getAllUser cada vez que se recarga la página
useEffect(() => {
getAllUser()
}, [])
  // Función para formatear fechas que vienen del backend
const formatDate = (isoDate) => {
if (!isoDate) return ''
const date = new Date(isoDate)
const day = String(date.getDate()).padStart(2, '0')
const month = String(date.getMonth() + 1).padStart(2, '0')
const year = date.getFullYear()
return `${day}/${month}/${year}`
}
 // Filtramos los usuarios según lo que se escribe en el buscador
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
            {modalMessageInfo && (
  <div 
    className="position-absolute top-50 start-50 translate-middle-x mt-4 p-3"
    style={{ 
      zIndex: 1100, 
      width: '90%', 
      maxWidth: '400px', 
      backgroundColor:  '#ff4d4f', 
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


)
}

export default ViewAllUser
