import React from 'react'
import HamburgerMenu from './HamburgerMenu'
import { useDispatch, useSelector} from 'react-redux'
import { useNavigate } from 'react-router'
import { doLoginOutAction } from '../landingPage/login/loginAction'


const HeadersComponent = () => {
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logOut = () => {
   
    localStorage.removeItem("token")
    localStorage.removeItem("token_refresh" )
    dispatch(
      doLoginOutAction()
    )
    navigate("/")
  }
  return (
    <header className='bg-dark d-flex flex-wrap align-items-center justify-content-between py-2 '>

      
      <div className='d-flex align-items-center'>
        <img
          className='headerLogo'
          src="/src/assets/HeaderAndFooter/LogoGlobeTrack.svg"
          alt="Logo"
        />
      </div>

   
      <div className='d-flex d-lg-none align-items-center justify-content-center menuHamburgerContainer '>
        <HamburgerMenu />
      </div>

     
      <div className='d-none d-lg-block flex-grow-1'>
        <nav className='nav justify-content-center'>
          <ul className='d-flex gap-4 list-unstyled m-0'>
            <li><button className='btn btn-outline-primary'>Publicaciones</button></li>
            <li><button className='btn btn-outline-primary'>Grupos</button></li>
            <li><button className='btn btn-outline-primary'>Ranking</button></li>
            <li><button className='btn btn-outline-primary'>Perfil</button></li>
            <li><button className='btn btn-outline-primary'>Notificaciones</button></li>
          </ul>
        </nav>
      </div>

  
      <div className='d-flex align-items-center gap-3 '>
        <img
          className='headerImage'
          src="/src/assets/HeaderAndFooter/ImgDefaultProfile.png"
          alt="Perfil"
        />
        <button className='btn btn-danger' onClick={logOut}>Cerrar Sesión</button>
      </div>

    </header>
  )
}

export default HeadersComponent
