// Importamos hooks, componentes y funciones necesarias
import React, { useState } from "react"; // useState para manejar estado local
import HamburgerMenu from "../HamburgerMenu"; // Componente del menú hamburguesa
import { useDispatch, useSelector } from "react-redux"; // Redux hooks para manejar estado global
import { useNavigate } from "react-router"; // Hook para navegar entre rutas
import { doLoginOutAction } from "../../landingPage/login/loginAction"; // Acción para cerrar sesión
import { changeMenuOption } from "./headerAction"; // Acción para cambiar la opción del menú
import { useEffect } from "react"; // useEffect para ejecutar efectos secundarios
import { getNotification } from "../../../core/services/notification/getNotification"; // Función para obtener notificaciones
import { deletedNotification } from "../../../core/services/notification/deleteNotification"; // Función para borrar notificaciones

const HeadersComponent = () => {
  // Estado para mostrar u ocultar el modal de notificaciones
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Estado donde se guardan las notificaciones recibidas
  const [notifications, setNotifications] = useState([]);
  
  // Estado para mostrar spinner o loading mientras cargan notificaciones
  const [loading, setLoading] = useState(false);

  // Obtenemos el usuario actual del store
  const user = useSelector((state) => state.loginReducer);

  // Hook para navegar entre rutas
  const navigate = useNavigate();

  // Hook para despachar acciones de Redux
  const dispatch = useDispatch();

  // Obtenemos la opción del menú seleccionada del store
  const { menuOptionsHeader } = useSelector((state) => state.menuReducerHeader);

  // Función para traer las notificaciones desde el backend
  const fetchNotifications = async () => {
    try {
      setLoading(true); // Activamos el loading
      const data = await getNotification(); // Llamada al backend
      console.log("Notificaciones recibidas:", data); // Para depuración
      setNotifications(data.notification || []); // Guardamos las notificaciones en el estado
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
    } finally {
      setLoading(false); // Desactivamos loading
    }
  };

  // Función para mostrar/ocultar modal de notificaciones
  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications); // Cambiamos el estado
    if (!showNotifications) {
      fetchNotifications(); // Si lo abrimos, cargamos las notificaciones
    }
  };

  // Función que se ejecuta al hacer click en una notificación
  const handleNotificationClick = async (notificationId) => {
    try {
      // Eliminamos la notificación en el backend
      await deletedNotification(notificationId);

      // Eliminamos la notificación de la lista en tiempo real
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
    } catch (err) {
      console.error("Error al marcar notificación como leída:", err);
    }
  };

  // Función para cerrar sesión
  const logOut = () => {
    // Eliminamos tokens del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("token_refresh");

    // Despachamos acción de logout al store
    dispatch(doLoginOutAction());

    // Eliminamos la opción del menú
    localStorage.removeItem("menuOption");

    // Navegamos al landing page
    setTimeout(() => {
      navigate("/");
    }, 50); // Se usa timeout para asegurar que todo se desmonte correctamente
  };

  // Funciones para navegar a diferentes páginas y actualizar el menú
  const goToPost = () => {
    navigate("/post"); // Navegamos a publicaciones
    dispatch(changeMenuOption(1)); // Actualizamos opción de menú
    localStorage.setItem("menuOption", 1); // Guardamos en localStorage
  };

  const goToHome = () => {
    navigate("/home");
    dispatch(changeMenuOption(0));
    localStorage.setItem("menuOption", 0);
  };

  const goToProfile = () => {
    navigate("/profile");
    dispatch(changeMenuOption(2));
    localStorage.setItem("menuOption", 2);
  };

  const goToGroupPage = () => {
    navigate("/group");
    dispatch(changeMenuOption(4));
    localStorage.setItem("menuOption", 4);
  };

  const goToRancking = () => {
    navigate("/ranking");
    dispatch(changeMenuOption(5));
    localStorage.setItem("menuOption", 5);
  };

  const goToControl = () => {
    navigate("/control"); // Solo admin
    dispatch(changeMenuOption(6))
    localStorage.setItem("menuOption", 6)
  };

  // useEffect para cargar opción de menú guardada al iniciar
  useEffect(() => {
    const savedOption = localStorage.getItem("menuOption");
    if (savedOption) {
      dispatch(changeMenuOption(Number(savedOption)));
    }
  }, []);

  

  // useEffect para cargar notificaciones al inicio
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Calculamos cantidad de notificaciones sin leer
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      {menuOptionsHeader === 0 ? (
        <header className="d-flex flex-wrap align-items-center justify-content-between py-2 w-100 bg-primary shadow-sm">
          <div className="d-flex align-items-center ms-2">
            <img
              className="headerLogo img-fluid "
              src="/src/assets/HeaderAndFooter/LogoGlobeTracked.png"
              alt="Logo"
              style={{ width: "60px", height: "50px" }}
            />
          </div>

          <div className="d-flex d-lg-none align-items-center justify-content-center">
            <HamburgerMenu  // Pasamos las funciones por props al componente hamburguer menu
              goToHome={goToHome}
              goToPost={goToPost}
              goToProfile={goToProfile}
              goToGroupPage={goToGroupPage}
              goToRancking={goToRancking}
              goToControl={goToControl}
              menuOptionsHeader={menuOptionsHeader}
              notifications={notifications} 
              unreadNotifications={unreadNotifications} 
              handleToggleNotifications={handleToggleNotifications} 
            />
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li>
                  <button className="btn btn-light">Home</button>
                </li>
                <li>
                  <button className="btn btn-outline-light" onClick={goToPost}>
                    Publicaciones
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToGroupPage}
                  >
                    Grupos
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToRancking}
                  >
                    Ranking
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToProfile}
                  >
                    Perfil
                  </button>
                </li>
                <li style={{ position: "relative" }}>
                  <button
                    className="btn btn-outline-light position-relative"
                    onClick={handleToggleNotifications}
                  >
                    Notificaciones
                    {unreadNotifications > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                        style={{ width: "10px", height: "10px" }}
                      ></span>
                    )}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="d-flex align-items-center gap-3 me-3">
            {/* Botón Panel de Control solo si es admin */}
            {user.user?.isAdmin === "admin" && (
              <img
                style={{ width: "20px", cursor: "pointer" }}
                onClick={goToControl}
                src="/src/assets/HeaderAndFooter/engranaje.png"
                alt=""
              />
            )}

            <img
              className="headerImage rounded-circle border border-light"
              src={
                user.user?.photoProfile?.trim() ||
                "/public/images/ImgDefaultProfile.png"
              }
              alt="Perfil"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <button className="btn btn-danger" onClick={logOut}>
              Cerrar Sesión
            </button>
          </div>
        </header>
      ) : menuOptionsHeader === 1 ? (
        <header className="d-flex flex-wrap align-items-center justify-content-between py-2 w-100 bg-primary shadow-sm">
          <div className="d-flex align-items-center ms-2">
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
              goToGroupPage={goToGroupPage}
              goToRancking={goToRancking}
              goToControl={goToControl}
              menuOptionsHeader={menuOptionsHeader}
              notifications={notifications} // <- PASAR
              unreadNotifications={unreadNotifications} // <- PASAR
              handleToggleNotifications={handleToggleNotifications} // <- PASAR
            />
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li>
                  <button className="btn btn-outline-light" onClick={goToHome}>
                    Home
                  </button>
                </li>
                <li>
                  <button className="btn btn-light">Publicaciones</button>
                </li>
                <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToGroupPage}
                  >
                    Grupos
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToRancking}
                  >
                    Ranking
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToProfile}
                  >
                    Perfil
                  </button>
                </li>
                <li style={{ position: "relative" }}>
                  <button
                    className="btn btn-outline-light position-relative"
                    onClick={handleToggleNotifications}
                  >
                    Notificaciones
                    {unreadNotifications > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                        style={{ width: "10px", height: "10px" }}
                      ></span>
                    )}
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div className="d-flex align-items-center gap-3 me-3">
            {/* Botón Panel de Control solo si es admin */}
            {user.user?.isAdmin === "admin" && (
              <img
                style={{ width: "20px", cursor: "pointer" }}
                onClick={goToControl}
                src="/src/assets/HeaderAndFooter/engranaje.png"
                alt=""
              />
            )}

            <img
              className="headerImage rounded-circle border border-light"
              src={
                user.user?.photoProfile?.trim() ||
                "/public/images/ImgDefaultProfile.png"
              }
              alt="Perfil"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <button className="btn btn-danger" onClick={logOut}>
              Cerrar Sesión
            </button>
          </div>
        </header>
      ) : menuOptionsHeader === 2 ? (
        <header className="d-flex flex-wrap align-items-center justify-content-between py-2 w-100 bg-primary shadow-sm">
          <div className="d-flex align-items-center ms-2 ">
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
              goToGroupPage={goToGroupPage}
              goToRancking={goToRancking}
              goToControl={goToControl}
              menuOptionsHeader={menuOptionsHeader}
              notifications={notifications} // <- PASAR
              unreadNotifications={unreadNotifications} // <- PASAR
              handleToggleNotifications={handleToggleNotifications} // <- PASAR
            />
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li>
                  <button className="btn btn-outline-light" onClick={goToHome}>
                    Home
                  </button>
                </li>
                <li>
                  <button className="btn btn-outline-light" onClick={goToPost}>
                    Publicaciones
                  </button>
                </li>
               
                <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToGroupPage}
                  >
                    Grupos
                  </button>
                </li>
               
                <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToRancking}
                  >
                    Ranking
                  </button>
                </li>
                  <li>
                  <button className="btn btn-light">Perfil</button>
                </li>
                <li style={{ position: "relative" }}>
                  <button
                    className="btn btn-outline-light position-relative"
                    onClick={handleToggleNotifications}
                  >
                    Notificaciones
                    {unreadNotifications > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                        style={{ width: "10px", height: "10px" }}
                      ></span>
                    )}
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div className="d-flex align-items-center gap-3 me-3">
            {/* Botón Panel de Control solo si es admin */}
            {user.user?.isAdmin === "admin" && (
              <img
                style={{ width: "20px", cursor: "pointer" }}
                onClick={goToControl}
                src="/src/assets/HeaderAndFooter/engranaje.png"
                alt=""
              />
            )}

            <img
              className="headerImage rounded-circle border border-light"
              src={
                user.user?.photoProfile?.trim() ||
                "/public/images/ImgDefaultProfile.png"
              }
              alt="Perfil"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <button className="btn btn-danger" onClick={logOut}>
              Cerrar Sesión
            </button>
          </div>
        </header>
      )
      //Este menu se despliega cuando estas viendo el perfil de otro usuario
      : menuOptionsHeader === 3 ? (
        <header className="d-flex flex-wrap align-items-center justify-content-between py-2 w-100 bg-primary shadow-sm">
          <div className="d-flex align-items-center ms-2">
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
              goToGroupPage={goToGroupPage}
              goToRancking={goToRancking}
              goToControl={goToControl}
              menuOptionsHeader={menuOptionsHeader}
              notifications={notifications} // <- PASAR
              unreadNotifications={unreadNotifications} // <- PASAR
              handleToggleNotifications={handleToggleNotifications} // <- PASAR
            />
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li>
                  <button className="btn btn-outline-light" onClick={goToHome}>
                    Home
                  </button>
                </li>
                <li>
                  <button className="btn btn-outline-light" onClick={goToPost}>
                    Publicaciones
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToGroupPage}
                  >
                    Grupos
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToProfile}
                  >
                    Perfil
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToRancking}
                  >
                    Ranking
                  </button>
                </li>
                <li style={{ position: "relative" }}>
                  <button
                    className="btn btn-outline-light position-relative"
                    onClick={handleToggleNotifications}
                  >
                    Notificaciones
                    {unreadNotifications > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                        style={{ width: "10px", height: "10px" }}
                      ></span>
                    )}
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div className="d-flex align-items-center gap-3 me-3">
            {/* Botón Panel de Control solo si es admin */}
            {user.user?.isAdmin === "admin" && (
              <img
                style={{ width: "20px", cursor: "pointer" }}
                onClick={goToControl}
                src="/src/assets/HeaderAndFooter/engranaje.png"
                alt=""
              />
            )}

            <img
              className="headerImage rounded-circle border border-light"
              src={
                user.user?.photoProfile?.trim() ||
                "/public/images/ImgDefaultProfile.png"
              }
              alt="Perfil"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <button className="btn btn-danger" onClick={logOut}>
              Cerrar Sesión
            </button>
          </div>
        </header>
      ) : menuOptionsHeader === 4 ? (
        <header className="d-flex flex-wrap align-items-center justify-content-between py-2 w-100 bg-primary shadow-sm">
          <div className="d-flex align-items-center ms-2">
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
              goToGroupPage={goToGroupPage}
              goToRancking={goToRancking}
              goToControl={goToControl}
              menuOptionsHeader={menuOptionsHeader}
              notifications={notifications} // <- PASAR
              unreadNotifications={unreadNotifications} // <- PASAR
              handleToggleNotifications={handleToggleNotifications} // <- PASAR
            />
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li>
                  <button className="btn btn-outline-light" onClick={goToHome}>
                    Home
                  </button>
                </li>
                <li>
                  <button className="btn btn-outline-light" onClick={goToPost}>
                    Publicaciones
                  </button>
                </li>
                <li>
                  <button className="btn btn-light">Grupos</button>
                </li>
                <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToRancking}
                  >
                    Ranking
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToProfile}
                  >
                    Perfil
                  </button>
                </li>
                
                <li style={{ position: "relative" }}>
                  <button
                    className="btn btn-outline-light position-relative"
                    onClick={handleToggleNotifications}
                  >
                    Notificaciones
                    {unreadNotifications > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                        style={{ width: "10px", height: "10px" }}
                      ></span>
                    )}
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div className="d-flex align-items-center gap-3 me-3">
            {/* Botón Panel de Control solo si es admin */}
            {user.user?.isAdmin === "admin" && (
              <img
                style={{ width: "20px", cursor: "pointer" }}
                onClick={goToControl}
                src="/src/assets/HeaderAndFooter/engranaje.png"
                alt=""
              />
            )}

            <img
              className="headerImage rounded-circle border border-light"
              src={
                user.user?.photoProfile?.trim() ||
                "/public/images/ImgDefaultProfile.png"
              }
              alt="Perfil"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <button className="btn btn-danger" onClick={logOut}>
              Cerrar Sesión
            </button>
          </div>
        </header>
      ) : menuOptionsHeader === 5 ? (
        <header className="d-flex flex-wrap align-items-center justify-content-between py-2 w-100 bg-primary shadow-sm">
          <div className="d-flex align-items-center ms-2">
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
              goToGroupPage={goToGroupPage}
              goToRancking={goToRancking}
              goToControl={goToControl}
              menuOptionsHeader={menuOptionsHeader}
              notifications={notifications} // <- PASAR
              unreadNotifications={unreadNotifications} // <- PASAR
              handleToggleNotifications={handleToggleNotifications} // <- PASAR
            />
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li>
                  <button className="btn btn-outline-light" onClick={goToHome}>
                    Home
                  </button>
                </li>
                <li>
                  <button className="btn btn-outline-light" onClick={goToPost}>
                    Publicaciones
                  </button>
                </li>
                 <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToGroupPage}
                  >
                    Grupos
                  </button>
                </li>
                <li>
                  <button className="btn btn-light">Ranking</button>
                </li>
                <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToProfile}
                  >
                    Perfil
                  </button>
                </li>
               
                <li style={{ position: "relative" }}>
                  <button
                    className="btn btn-outline-light position-relative"
                    onClick={handleToggleNotifications}
                  >
                    Notificaciones
                    {unreadNotifications > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                        style={{ width: "10px", height: "10px" }}
                      ></span>
                    )}
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div className="d-flex align-items-center gap-3 me-3">
            {/* Botón Panel de Control solo si es admin */}
            {user.user?.isAdmin === "admin" && (
              <img
                style={{ width: "20px", cursor: "pointer" }}
                onClick={goToControl}
                src="/src/assets/HeaderAndFooter/engranaje.png"
                alt=""
              />
            )}

            <img
              className="headerImage rounded-circle border border-light"
              src={
                user.user?.photoProfile?.trim() ||
                "/public/images/ImgDefaultProfile.png"
              }
              alt="Perfil"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <button className="btn btn-danger" onClick={logOut}>
              Cerrar Sesión
            </button>
          </div>
        </header>
      ) : menuOptionsHeader === 6 ? ( <header className="d-flex flex-wrap align-items-center justify-content-between py-2 w-100 bg-primary shadow-sm">
          <div className="d-flex align-items-center ms-2">
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
              goToGroupPage={goToGroupPage}
              goToRancking={goToRancking}
              goToControl={goToControl}
            
              menuOptionsHeader={menuOptionsHeader}
              notifications={notifications} 
              unreadNotifications={unreadNotifications} 
              handleToggleNotifications={handleToggleNotifications} 
            />
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li>
                  <button className="btn btn-outline-light" onClick={goToHome}>
                    Home
                  </button>
                </li>
                <li>
                  <button className="btn btn-outline-light" onClick={goToPost}>
                    Publicaciones
                  </button>
                </li>
                 <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToGroupPage}
                  >
                    Grupos
                  </button>
                </li>
                <li>
                  <button className="btn btn-outline-light" onClick={goToRancking}>Ranking</button>
                </li>
                <li>
                  <button
                    className="btn btn-outline-light"
                    onClick={goToProfile}
                  >
                    Perfil
                  </button>
                </li>
               
                <li style={{ position: "relative" }}>
                  <button
                    className="btn btn-outline-light position-relative"
                    onClick={handleToggleNotifications}
                  >
                    Notificaciones
                    {unreadNotifications > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                        style={{ width: "10px", height: "10px" }}
                      ></span>
                    )}
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div className="d-flex align-items-center gap-3 me-3">
            {/* Botón Panel de Control solo si es admin */}
            {user.user?.isAdmin === "admin" && (
              <img
                style={{ width: "20px", cursor: "pointer" }}
                onClick={goToControl}
                src="/src/assets/HeaderAndFooter/engranaje.png"
                alt=""
              />
            )}

            <img
              className="headerImage rounded-circle border border-light"
              src={
                user.user?.photoProfile?.trim() ||
                "/public/images/ImgDefaultProfile.png"
              }
              alt="Perfil"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <button className="btn btn-danger" onClick={logOut}>
              Cerrar Sesión
            </button>
          </div>
        </header>) : null}
      {showNotifications && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}
        >
          <div
            className="bg-white text-dark shadow rounded p-3"
            style={{
              width: "350px",
              maxHeight: "400px",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setShowNotifications(false)}
              className="btn btn-sm btn-danger position-absolute"
              style={{ top: "10px", right: "10px" }}
            >
              ×
            </button>

            <h5 className="mb-3 text-center">Notificaciones</h5>

            {loading ? (
              <p className="text-center">Cargando...</p>
            ) : notifications.length === 0 ? (
              <p className="text-muted text-center">
                No hay nuevas notificaciones.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n._id)}
                  className="border-bottom py-2 px-2 rounded"
                  style={{ cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f1f1f1")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {n.message}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadersComponent;

// VER MAÑANA PARA VER SI LO PONEMOS

// notifications.map((n) => (
//   <div
//     key={n._id}
//     onClick={() => handleNotificationClick(n._id)}
//     className="border-bottom py-2 px-2 rounded"
//     style={{ cursor: "pointer", transition: "background 0.2s" }}
//     onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f1f1")}
//     onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//   >
//     <span style={{ fontWeight: 'bold', marginRight: '5px', textTransform: 'capitalize' }}>
//       {n.type}:
//     </span>
//     <span>{n.message}</span>
//   </div>
// ))
