import React from 'react'
import HamburgerMenu from '../HamburgerMenu'
import { useDispatch, useSelector} from 'react-redux'
import { useNavigate } from 'react-router'
import { doLoginOutAction } from '../../landingPage/login/loginAction'
import { changeMenuOption } from './headerAction'



const HeadersComponent = () => {
  const user = useSelector(state => state.loginReducer)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {menuOptionsHeader} = useSelector(state => state.menuReducerHeader)
  const logOut = () => {
   
    localStorage.removeItem("token")
    localStorage.removeItem("token_refresh" )
    dispatch(
      doLoginOutAction()
    )
    navigate("/")
  }

  const goToPost = async() => {
    navigate("/post")
    localStorage.getItem("token")
   dispatch(
    changeMenuOption(1)
   )
  }

  const goToHome = async() => {
    navigate("/home")
    dispatch(
      changeMenuOption(0)
    )
  }

  return (
    <div>
      {menuOptionsHeader === 0 ? (
          <header className='bgHeader d-flex flex-wrap align-items-center justify-content-between py-2 w-100'>

      
      <div className='d-flex align-items-center'>
        <img
          className='headerLogo'
          src="/src/assets/HeaderAndFooter/LogoGlobeTrack.svg"
          alt="Logo"
        />
      </div>

   
      <div className='d-flex d-lg-none align-items-center justify-content-center menuHamburgerContainer '>
        <HamburgerMenu 
        goToHome={goToHome}
        goToPost={goToPost}
        menuOptionsHeader={menuOptionsHeader}
        />
      </div>

     
      <div className='d-none d-lg-block flex-grow-1'>
        <nav className='nav justify-content-center'>
          <ul className='d-flex gap-4 list-unstyled m-0'>
            <li><button className='btn btn-outline-primary btn-outline-primary-hover' onClick={goToPost}>Publicaciones</button></li>
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
          src={user.user?.photoProfile?.trim() || "/public/images/ImgDefaultProfile.png"}
          alt="Perfil"
          
        />
        <button className='btn btn-danger' onClick={logOut}>Cerrar Sesión</button>
      </div>

    </header>
      ) : menuOptionsHeader === 1 ? (
          <header className='bgHeader d-flex flex-wrap align-items-center justify-content-between py-2 w-100'>

      
      <div className='d-flex align-items-center'>
        <img
          className='headerLogo'
          src="/src/assets/HeaderAndFooter/LogoGlobeTrack.svg"
          alt="Logo"
        />
      </div>

      

   
      <div className='d-flex d-lg-none align-items-center justify-content-center menuHamburgerContainer '>
        <HamburgerMenu 
        goToHome={goToHome}
        goToPost={goToPost}
        menuOptionsHeader={menuOptionsHeader}/>
      </div>

     
      <div className='d-none d-lg-block flex-grow-1'>
        <nav className='nav justify-content-center'>
          <ul className='d-flex gap-4 list-unstyled m-0'>
            <li><button className='btn btn-outline-primary btn-outline-primary-hover' onClick={goToHome}>Home</button></li>
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
          src={user.user?.photoProfile?.trim() || "/public/images/ImgDefaultProfile.png"}
          alt="Perfil"
          
        />
        <button className='btn btn-danger' onClick={logOut}>Cerrar Sesión</button>
      </div>

    </header>
      ) : ( null)}
  
    </div>
  )
}

export default HeadersComponent
