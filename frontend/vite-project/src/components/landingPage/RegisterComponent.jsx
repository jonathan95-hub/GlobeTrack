// Importamos React y useState
import React, { useState } from 'react'
// Importamos la función de registro del backend
import { register } from '../../core/services/landinPage/registerFetch'

// Componente de registro
const RegisterComponent = ({ setMenuOptionsInit }) => {

    const [isSuccess, setIsSuccess] = useState(false)

    const [messageInfo, setMessageInfo] = useState("")
    const [modalMessageInfo, setModalMessageInfo] = useState(false)
  // Estado donde guardamos los datos del formulario
  const [registerData, setRegisterData] = useState({
    name: "",
    lastName: "",
    email: "",
    birthDate: "",
    password: "",
    country: "",
    city: "",
  })

  // Función que actualiza el estado cuando el usuario escribe en un input
  const inputHandler = (nameProps, valueProps) => {
    setRegisterData({
      ...registerData,
      [nameProps]: valueProps
    })
  }

  // Función para volver al menú inicial
  const backToLanding = () => {
    setMenuOptionsInit("INIT")
  }

  // Función para enviar los datos al backend y registrar usuario
 const signupUser = async () => {
  try {
    const registerUser = await register(registerData)

   if (registerUser.status === "Failed" || registerUser.status === "Error") {
  setIsSuccess(false) // si hay algun error el succeso es falso
  setMessageInfo(registerUser.message)
  setModalMessageInfo(true)
  return
}

// si el registro es exitoso
setIsSuccess(true) // seteamos isSuccess en true
setMessageInfo("Registro exitoso")
setModalMessageInfo(true)

// Esperar 2 segundos y luego volver al menú
setTimeout(() => {
  setModalMessageInfo(false)
  backToLanding()
}, 2000)

  } catch (error) {
    console.error("Error de registro:", error.message)
    setMessageInfo(error.message)
    setModalMessageInfo(true)
  }
}


  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light px-3">
      {/* card central del formulario */}
      <div
        className="card shadow-lg border-0 rounded-4 p-4 p-md-5"
        style={{ maxWidth: '500px', width: '100%' }}
      >
        <h3 className="text-center mb-4 fw-bold text-primary">Crear cuenta</h3>

        {/* Formulario de registro */}
        <form className="register-form">

          {/* Nombre */}
          <div className="form-group mb-3">
            <label className="fw-semibold text-secondary">Nombre</label>
            <input
              type="text"
              className="form-control rounded-3"
              name='name'
              value={registerData.name}
              onChange={(e) => inputHandler(e.target.name, e.target.value)}
              placeholder="Introduce tu nombre"
            />
          </div>

          {/* Apellidos */}
          <div className="form-group mb-3">
            <label className="fw-semibold text-secondary">Apellidos</label>
            <input
              type="text"
              className="form-control rounded-3"
              name='lastName'
              value={registerData.lastName}
              onChange={(e) => inputHandler(e.target.name, e.target.value)}
              placeholder="Introduce tus apellidos"
            />
          </div>

          {/* Email */}
          <div className="form-group mb-3">
            <label className="fw-semibold text-secondary">Correo electrónico</label>
            <input
              type="email"
              className="form-control rounded-3"
              name='email'
              value={registerData.email}
              onChange={(e) => inputHandler(e.target.name, e.target.value)}
              placeholder="Introduce tu email"
            />
          </div>

          {/* Fecha de nacimiento */}
          <div className="form-group mb-3">
            <label className="fw-semibold text-secondary">Fecha de nacimiento</label>
            <input
              type="date"
              className="form-control rounded-3"
              name='birthDate'
              value={registerData.birthDate}
              onChange={(e) => inputHandler(e.target.name, e.target.value)}
            />
          </div>

          {/* Contraseña */}
          <div className="form-group mb-3">
            <label className="fw-semibold text-secondary">Contraseña</label>
            <input
              type="password"
              className="form-control rounded-3"
              name='password'
              value={registerData.password}
              onChange={(e) => inputHandler(e.target.name, e.target.value)}
              placeholder="Introduce tu contraseña"
            />
          </div>

          {/* País */}
          <div className="form-group mb-3">
            <label className="fw-semibold text-secondary">País</label>
            <input
              type="text"
              className="form-control rounded-3"
              name='country'
              value={registerData.country}
              onChange={(e) => inputHandler(e.target.name, e.target.value)}
              placeholder="Introduce tu país"
            />
          </div>

          {/* Ciudad */}
          <div className="form-group mb-4">
            <label className="fw-semibold text-secondary">Ciudad</label>
            <input
              type="text"
              className="form-control rounded-3"
              name='city'
              value={registerData.city}
              onChange={(e) => inputHandler(e.target.name, e.target.value)}
              placeholder="Introduce tu ciudad"
            />
          </div>

          {/* Botones de enviar y cancelar */}
          <div className="d-flex flex-column gap-3">
            <button
              type="submit"
              className="btn btn-primary w-100 rounded-3 fw-semibold shadow-sm"
              onClick={(e) => { e.preventDefault(); signupUser() }} // Prevenimos refresh y llamamos a signupUser
            >
              Registrarse
            </button>
            <button
              type="button"
              className="btn btn-outline-primary w-100 rounded-3 fw-semibold"
              onClick={backToLanding} // Volvemos al menú inicial
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
      {modalMessageInfo && (
  <div 
    className="position-absolute top-50 start-50 translate-middle-x mt-4 p-3"
    style={{ 
      zIndex: 1100, 
      width: '90%', 
      maxWidth: '400px', 
      backgroundColor: isSuccess ? '#28a745' : '#ff4d4f', // verde si el registro es exitoso, rojo si hay algun error
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

export default RegisterComponent
