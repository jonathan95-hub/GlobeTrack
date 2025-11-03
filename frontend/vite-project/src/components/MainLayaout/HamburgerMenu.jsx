import React, { useState } from 'react'
import { changeMenuOption } from './Header/headerAction'
import { useDispatch } from 'react-redux'

const HamburgerMenu = (props) => {
  const{
    goToHome,
    goToPost,
    menuOptionsHeader
  } = props
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen(!isOpen) 
  }

  const handleGoToPost = () => {
    goToPost()
    dispatch(changeMenuOption(1)) // cambia el menú a "Publicaciones"
    setIsOpen(false)
  }

  const handleGoToHome = () => {
    goToHome()
    dispatch(changeMenuOption(0))
    setIsOpen(false)
  }
  return (
    <div className='position-relative text-center bg-dark me-4'>
      <button className='bg-dark' onClick={toggle}>
        <img className='bg-dark iconoMenuImg'
          src="/src/assets/HeaderAndFooter/IconoMenuDesplegableGlobeTrackVersionMovil.png" 
          alt="Menu" 
        />
      </button>

      {isOpen && (
        <div className='position-absolute start-50 translate-middle-x mt-4 border card bg-dark p-4 rounded-5'>
          {menuOptionsHeader === 0 ? (
            <nav>
          <ul className="d-flex flex-column gap-2 m-0 p-0">
            <li >
              <button className="btn btn-primary w-100 px-5" onClick={handleGoToPost}>Publicaciones</button>
            </li>
            <li>
              <button className="btn btn-primary w-100 px-5">Grupos</button>
            </li>
            <li>
              <button className="btn btn-primary w-100 px-5">Ranking de fotos</button>
            </li>
            <li>
              <button className="btn btn-primary w-100 px-5">Mi perfil</button>
            </li>
            <li>
              <button className="btn btn-primary w-100 px-5">Notificaciones</button>
            </li>
          </ul>
        </nav>
          ) : menuOptionsHeader === 1 ? (
              <nav>
          <ul className="d-flex flex-column gap-2 m-0 p-0">
            <li >
              <button className="btn btn-primary w-100 px-5" onClick={handleGoToHome}>Home</button>
            </li>
            <li>
              <button className="btn btn-primary w-100 px-5">Grupos</button>
            </li>
            <li>
              <button className="btn btn-primary w-100 px-5">Ranking de fotos</button>
            </li>
            <li>
              <button className="btn btn-primary w-100 px-5">Mi perfil</button>
            </li>
            <li>
              <button className="btn btn-primary w-100 px-5">Notificaciones</button>
            </li>
          </ul>
        </nav>
          ) : ( null)}
        
        </div>
      )}
    </div>
  )
}

export default HamburgerMenu
