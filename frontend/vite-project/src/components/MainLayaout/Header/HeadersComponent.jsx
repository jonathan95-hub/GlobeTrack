import React from 'react';
import HamburgerMenu from '../HamburgerMenu';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { doLoginOutAction } from '../../landingPage/login/loginAction';
import { changeMenuOption } from './headerAction';
import { useEffect } from 'react';

const HeadersComponent = () => {
  const user = useSelector(state => state.loginReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { menuOptionsHeader } = useSelector(state => state.menuReducerHeader);

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_refresh");
    dispatch(doLoginOutAction());
    localStorage.removeItem("menuOption")
        setTimeout(() => {  // Asegura desmontar todo con tiempo
    navigate("/");
  }, 50);
  };

  const goToPost = async () => {
    navigate("/post");
    localStorage.getItem("token");
    dispatch(changeMenuOption(1));
    localStorage.setItem("menuOption", 1);
  };

  const goToHome = async () => {
    navigate("/home");
    dispatch(changeMenuOption(0));
    localStorage.setItem("menuOption", 0);
  };

  const goToProfile = async () => {
    navigate("/profile");
    localStorage.getItem("Token");
    dispatch(changeMenuOption(2));
    localStorage.setItem("menuOption", 2);
  };

  useEffect(() => {
    const savedOption = localStorage.getItem("menuOption");
    if (savedOption) {
      dispatch(changeMenuOption(Number(savedOption)));
    }
  }, []);

  return (
    <div>
      {menuOptionsHeader === 0 ? (
        <header className="d-flex flex-wrap align-items-center justify-content-between py-2 w-100 bg-primary shadow-sm">

          <div className="d-flex align-items-center ms-3">
            <img
              className="headerLogo img-fluid "
              src="/src/assets/HeaderAndFooter/LogoGlobeTracked.png"
              alt="Logo"
              style={{width: "60px", height: "50px" }}
            />
          </div>

          <div className="d-flex d-lg-none align-items-center justify-content-center">
            <HamburgerMenu 
              goToHome={goToHome}
              goToPost={goToPost}
              goToProfile={goToProfile}
              menuOptionsHeader={menuOptionsHeader}
            />
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li><button className="btn btn-outline-light" onClick={goToPost}>Publicaciones</button></li>
                <li><button className="btn btn-outline-light">Grupos</button></li>
                <li><button className="btn btn-outline-light">Ranking</button></li>
                <li><button className="btn btn-outline-light" onClick={goToProfile}>Perfil</button></li>
                <li><button className="btn btn-outline-light">Notificaciones</button></li>
              </ul>
            </nav>
          </div>

          <div className="d-flex align-items-center gap-3 me-3">
            <img
              className="headerImage rounded-circle border border-light"
              src={user.user?.photoProfile?.trim() || "/public/images/ImgDefaultProfile.png"}
              alt="Perfil"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <button className="btn btn-danger" onClick={logOut}>Cerrar Sesión</button>
          </div>
        </header>
      ) : menuOptionsHeader === 1 ? (
        <header className="d-flex flex-wrap align-items-center justify-content-between py-2 w-100 bg-primary shadow-sm">

          <div className="d-flex align-items-center ms-3">
            <img
              className="headerLogo img-fluid"
              src="/src/assets/HeaderAndFooter/LogoGlobeTracked.png"
              alt="Logo"
              style={{ height: "50px" }}
            />
          </div>

          <div className="d-flex d-lg-none align-items-center justify-content-center">
            <HamburgerMenu 
              goToHome={goToHome}
              goToPost={goToPost}
              goToProfile={goToProfile}
              menuOptionsHeader={menuOptionsHeader}
            />
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li><button className="btn btn-outline-light" onClick={goToHome}>Home</button></li>
                <li><button className="btn btn-outline-light">Grupos</button></li>
                <li><button className="btn btn-outline-light">Ranking</button></li>
                <li><button className="btn btn-outline-light" onClick={goToProfile}>Perfil</button></li>
                <li><button className="btn btn-outline-light">Notificaciones</button></li>
              </ul>
            </nav>
          </div>

          <div className="d-flex align-items-center gap-3 me-3">
            <img
              className="headerImage rounded-circle border border-light"
              src={user.user?.photoProfile?.trim() || "/public/images/ImgDefaultProfile.png"}
              alt="Perfil"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <button className="btn btn-danger " onClick={logOut}>Cerrar Sesión</button>
          </div>
        </header>
      ) : menuOptionsHeader === 2 ? (
        <header className="d-flex flex-wrap align-items-center justify-content-between py-2 w-100 bg-primary shadow-sm">

          <div className="d-flex align-items-center ms-5">
            <img
              className="headerLogo img-fluid"
              src="/src/assets/HeaderAndFooter/LogoGlobeTracked.png"
              alt="Logo"
              style={{ height: "60px" }}
            />
          </div>

          <div className="d-flex d-lg-none align-items-center justify-content-center">
            <HamburgerMenu 
              goToHome={goToHome}
              goToPost={goToPost}
              goToProfile={goToProfile}
              menuOptionsHeader={menuOptionsHeader}
            />
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li><button className="btn btn-outline-light" onClick={goToHome}>Home</button></li>
                <li><button className="btn btn-outline-light" onClick={goToPost}>Publicaciones</button></li>
                <li><button className="btn btn-outline-light">Grupos</button></li>
                <li><button className="btn btn-outline-light">Ranking</button></li>
                <li><button className="btn btn-outline-light">Notificaciones</button></li>
              </ul>
            </nav>
          </div>

          <div className="d-flex align-items-center gap-3 me-3">
            <img
              className="headerImage rounded-circle border border-light"
              src={user.user?.photoProfile?.trim() || "/public/images/ImgDefaultProfile.png"}
              alt="Perfil"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <button className="btn btn-danger " onClick={logOut}>Cerrar Sesión</button>
          </div>
        </header>
      ) : menuOptionsHeader === 3 ? (
        <header className="d-flex flex-wrap align-items-center justify-content-between py-2 w-100 bg-primary shadow-sm">

          <div className="d-flex align-items-center ms-5">
            <img
              className="headerLogo img-fluid"
              src="/src/assets/HeaderAndFooter/LogoGlobeTracked.png"
              alt="Logo"
              style={{ height: "60px" }}
            />
          </div>

          <div className="d-flex d-lg-none align-items-center justify-content-center">
            <HamburgerMenu 
              goToHome={goToHome}
              goToPost={goToPost}
              goToProfile={goToProfile}
              menuOptionsHeader={menuOptionsHeader}
            />
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li><button className="btn btn-outline-light" onClick={goToHome}>Home</button></li>
                <li><button className="btn btn-outline-light" onClick={goToPost}>Publicaciones</button></li>
                <li><button className="btn btn-outline-light">Grupos</button></li>
                <li><button className="btn btn-outline-light" onClick={goToProfile}>Perfil</button></li>
                <li><button className="btn btn-outline-light">Ranking</button></li>
                <li><button className="btn btn-outline-light">Notificaciones</button></li>
              </ul>
            </nav>
          </div>

          <div className="d-flex align-items-center gap-3 me-3">
            <img
              className="headerImage rounded-circle border border-light"
              src={user.user?.photoProfile?.trim() || "/public/images/ImgDefaultProfile.png"}
              alt="Perfil"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <button className="btn btn-danger " onClick={logOut}>Cerrar Sesión</button>
          </div>
        </header>
      ) : (null)}
    </div>
  );
};

export default HeadersComponent;
