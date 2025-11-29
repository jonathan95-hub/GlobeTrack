// Importamos React y hooks necesarios
import React, { useState } from 'react'

// Importamos acción para cambiar la opción del menú en Redux
import { changeMenuOption } from './Header/headerAction'

// Importamos hooks de Redux
import { useDispatch, useSelector } from 'react-redux'

// Componente del menú hamburguesa
const HamburgerMenu = (props) => {
  // Desestructuramos las funciones que nos pasan por props para navegar
  const {
    goToHome,
    goToPost,
    goToProfile,
    goToGroupPage,
    goToRancking
  } = props

  const dispatch = useDispatch() // Hook para despachar acciones
  const [isOpen, setIsOpen] = useState(false) // Estado para saber si el menú está abierto
  const { menuOptionsHeader } = useSelector(state => state.menuReducerHeader) // Obtenemos la opción de menú seleccionada del store

  // Función para abrir/cerrar el menú hamburguesa
  const toggle = () => {
    setIsOpen(!isOpen) // Cambiamos el estado a su opuesto
  }

  // Funciones que navegan a cada sección y cierran el menú
  const handleGoToPost = () => {
    goToPost() // Navegamos a publicaciones
    dispatch(changeMenuOption(1)) // Cambiamos opción del menú en Redux
    setIsOpen(false) // Cerramos el menú
  }

  const handleGoToHome = () => {
    goToHome()
    dispatch(changeMenuOption(0))
    setIsOpen(false)
  }

  const handleGoToProfile = () => {
    goToProfile()
    dispatch(changeMenuOption(2))
    setIsOpen(false)
  }

  const handleGoToGroupPage = () => {
    goToGroupPage()
    dispatch(changeMenuOption(4))
    setIsOpen(false)
  }

  const handleGoToRancking = () => {
    goToRancking()
    dispatch(changeMenuOption(5))
    setIsOpen(false)
  }
  return (
    <div className='position-relative text-center me-4'>
      <button
        className='btn p-2 rounded-circle shadow-sm'
        style={{ backgroundColor: '#0d6efd', border: 'none' }}
        onClick={toggle}
      >
        <img 
          className='iconoMenuImg'
          src="/src/assets/HeaderAndFooter/IconoMenuDesplegableGlobeTrackVersionMovil.png" 
          alt="Menu" 
          style={{ width: "30px", height: "30px" }}
        />
      </button>

      {isOpen && (
        <div
          className='position-absolute start-50 translate-middle-x mt-2 p-3 rounded-4 shadow-lg'
          style={{
            zIndex: 1050,
            minWidth: "200px",
            backgroundColor: '#0d6efd', // fondo sólido azul
          }}
        >
          {menuOptionsHeader === 0 ? (
            <nav>
              <ul className="d-flex flex-column gap-2 m-0 p-0">
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToHome}>Home</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToPost}>Publicaciones</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToGroupPage}>Grupos</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToRancking}>Ranking</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToProfile}>Perfil</button></li>
                <li style={{ position: "relative" }}>
  <button className="btn btn-light w-100 fw-semibold" onClick={props.handleToggleNotifications}>
    Notificaciones
  </button>
  {props.unreadNotifications > 0 && (
    <span
      style={{
        position: "absolute",
        top: "8px",
        right: "10px",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: "red",
        display: "inline-block",
      }}
    ></span>
  )}
</li>

              </ul>
            </nav>
          ) : menuOptionsHeader === 1 ? (
            <nav>
              <ul className="d-flex flex-column gap-2 m-0 p-0">
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToHome}>Home</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToPost}>Publicaciones</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToGroupPage}>Grupos</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToRancking}>Ranking</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToProfile}>Perfil</button></li>
                <li style={{ position: "relative" }}>
  <button className="btn btn-light w-100 fw-semibold" onClick={props.handleToggleNotifications}>
    Notificaciones
  </button>
  {props.unreadNotifications > 0 && (
    <span
      style={{
        position: "absolute",
        top: "8px",
        right: "10px",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: "red",
        display: "inline-block",
      }}
    ></span>
  )}
</li>

              </ul>
            </nav>
          ) : menuOptionsHeader === 2 ? (
            <nav>
              <ul className="d-flex flex-column gap-2 m-0 p-0">
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToHome}>Home</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToPost}>Publicaciones</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToGroupPage}>Grupos</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToRancking}>Ranking</button></li>
                 <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToProfile}>Perfil</button></li>
                <li style={{ position: "relative" }}>
  <button className="btn btn-light w-100 fw-semibold" onClick={props.handleToggleNotifications}>
    Notificaciones
  </button>
  {props.unreadNotifications > 0 && (
    <span
      style={{
        position: "absolute",
        top: "8px",
        right: "10px",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: "red",
        display: "inline-block",
      }}
    ></span>
  )}
</li>

              </ul>
            </nav>
          ) : menuOptionsHeader === 3 ? (<nav>
              <ul className="d-flex flex-column gap-2 m-0 p-0">
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToHome}>Home</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToPost}>Publicaciones</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToGroupPage}>Grupos</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToRancking}>Ranking</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToProfile}>Perfil</button></li>
                <li style={{ position: "relative" }}>
  <button className="btn btn-light w-100 fw-semibold" onClick={props.handleToggleNotifications}>
    Notificaciones
  </button>
  {props.unreadNotifications > 0 && (
    <span
      style={{
        position: "absolute",
        top: "8px",
        right: "10px",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: "red",
        display: "inline-block",
      }}
    ></span>
  )}
</li>

              </ul>
            </nav>) : menuOptionsHeader === 4 ? (
              <nav>
               <ul className="d-flex flex-column gap-2 m-0 p-0">
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToHome}>Home</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToPost}>Publicaciones</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToGroupPage}>Grupos</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToRancking}>Ranking</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToProfile}>Perfil</button></li>
                <li style={{ position: "relative" }}>
  <button className="btn btn-light w-100 fw-semibold" onClick={props.handleToggleNotifications}>
    Notificaciones
  </button>
  {props.unreadNotifications > 0 && (
    <span
      style={{
        position: "absolute",
        top: "8px",
        right: "10px",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: "red",
        display: "inline-block",
      }}
    ></span>
  )}
</li>

              </ul>
              </nav>
            ) : menuOptionsHeader === 5 ? (
               <nav>
               <ul className="d-flex flex-column gap-2 m-0 p-0">
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToHome}>Home</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToPost}>Publicaciones</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToGroupPage}>Grupos</button></li>
                 <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToRancking}>Ranking</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToProfile}>Perfil</button></li>
                <li style={{ position: "relative" }}>
  <button className="btn btn-light w-100 fw-semibold" onClick={props.handleToggleNotifications}>
    Notificaciones
  </button>
  {props.unreadNotifications > 0 && (
    <span
      style={{
        position: "absolute",
        top: "8px",
        right: "10px",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: "red",
        display: "inline-block",
      }}
    ></span>
  )}
</li>

              </ul>
              </nav>
            ) : menuOptionsHeader === 6 ? (<nav>
              <ul className="d-flex flex-column gap-2 m-0 p-0">
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToHome}>Home</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToPost}>Publicaciones</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToGroupPage}>Grupos</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToRancking}>Ranking</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToProfile}>Perfil</button></li>
                <li style={{ position: "relative" }}>
  <button className="btn btn-light w-100 fw-semibold" onClick={props.handleToggleNotifications}>
    Notificaciones
  </button>
  {props.unreadNotifications > 0 && (
    <span
      style={{
        position: "absolute",
        top: "8px",
        right: "10px",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: "red",
        display: "inline-block",
      }}
    ></span>
  )}
</li>

              </ul>
            </nav>) : (null)}
        </div>
      )}
    </div>
  )
}

export default HamburgerMenu
