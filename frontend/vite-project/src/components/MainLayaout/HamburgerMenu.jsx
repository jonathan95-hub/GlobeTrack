import React, { useState } from 'react'

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => {
    setIsOpen(!isOpen) 
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
        <nav>
          <ul className="d-flex flex-column gap-2 m-0 p-0">
            <li >
              <button className="btn btn-primary w-100 px-5">Publicaciones</button>
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
        </div>
      )}
    </div>
  )
}

export default HamburgerMenu
