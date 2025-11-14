import React, { useState } from 'react'
import { changeMenuOption } from './Header/headerAction'
import { useDispatch, useSelector } from 'react-redux'

const HamburgerMenu = (props) => {
  const{
    goToHome,
    goToPost,
    goToProfile,
    goToGroupPage
    
  } = props
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const {menuOptionsHeader} = useSelector(state => state.menuReducerHeader)
  const toggle = () => {
    setIsOpen(!isOpen) 
  }

  const handleGoToPost = () => {
    goToPost()
    dispatch(changeMenuOption(1)) 
    setIsOpen(false)
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
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToPost}>Publicaciones</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToGroupPage}>Grupos</button></li>
                <li><button className="btn btn-light w-100 fw-semibold">Ranking</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToProfile}>Mi perfil</button></li>
                <li><button className="btn btn-light w-100 fw-semibold">Notificaciones</button></li>
              </ul>
            </nav>
          ) : menuOptionsHeader === 1 ? (
            <nav>
              <ul className="d-flex flex-column gap-2 m-0 p-0">
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToHome}>Home</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToGroupPage}>Grupos</button></li>
                <li><button className="btn btn-light w-100 fw-semibold">Ranking</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToProfile}>Mi perfil</button></li>
                <li><button className="btn btn-light w-100 fw-semibold">Notificaciones</button></li>
              </ul>
            </nav>
          ) : menuOptionsHeader === 2 ? (
            <nav>
              <ul className="d-flex flex-column gap-2 m-0 p-0">
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToHome}>Home</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToPost}>Publicaciones</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToGroupPage}>Grupos</button></li>
                <li><button className="btn btn-light w-100 fw-semibold">Ranking</button></li>
                <li><button className="btn btn-light w-100 fw-semibold">Notificaciones</button></li>
              </ul>
            </nav>
          ) : menuOptionsHeader === 3 ? (<nav>
              <ul className="d-flex flex-column gap-2 m-0 p-0">
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToHome}>Home</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToPost}>Publicaciones</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToGroupPage}>Grupos</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToProfile}>Perfil</button></li>
                <li><button className="btn btn-light w-100 fw-semibold">Ranking</button></li>
                <li><button className="btn btn-light w-100 fw-semibold">Notificaciones</button></li>
              </ul>
            </nav>) : menuOptionsHeader === 4 ? (
               <ul className="d-flex flex-column gap-2 m-0 p-0">
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToHome}>Home</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToPost}>Publicaciones</button></li>
                <li><button className="btn btn-light w-100 fw-semibold" onClick={handleGoToProfile}>Perfil</button></li>
                <li><button className="btn btn-light w-100 fw-semibold">Ranking</button></li>
                <li><button className="btn btn-light w-100 fw-semibold">Notificaciones</button></li>
              </ul>
            ) : (null)}
        </div>
      )}
    </div>
  )
}

export default HamburgerMenu
