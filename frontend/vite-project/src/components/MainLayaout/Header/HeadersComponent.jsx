import React,{useState}from 'react';
import HamburgerMenu from '../HamburgerMenu';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { doLoginOutAction } from '../../landingPage/login/loginAction';
import { changeMenuOption } from './headerAction';
import { useEffect } from 'react';
import { getNotification } from '../../../core/services/notification/getNotification';
import { markNotificationAsRead } from '../../../core/services/notification/readNotification';

const HeadersComponent = () => {
    const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const[isAdmin, setIsAdmin] = useState(false)
   const user = useSelector(state => state.loginReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { menuOptionsHeader } = useSelector(state => state.menuReducerHeader);

const fetchNotifications = async () => {
  try {
    setLoading(true);
    const data = await getNotification();
    console.log("Notificaciones recibidas:", data); // para depuración
    setNotifications(data.notification || []); // <--- aquí estaba el problema
  } catch (err) {
    console.error("Error al cargar notificaciones:", err);
  } finally {
    setLoading(false);
  }
};


  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotifications();
    }
  };



const handleNotificationClick = async (notificationId) => {
  try {
    // Marcamos como leída en el backend
    await markNotificationAsRead(notificationId);

    // Eliminamos de la lista en tiempo real
    setNotifications(prev =>
      prev.filter(notification => notification._id !== notificationId)
    );
  } catch (err) {
    console.error("Error al marcar notificación como leída:", err);
  }
};

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_refresh");
    dispatch(doLoginOutAction());
    localStorage.removeItem("menuOption")
        setTimeout(() => {  // Asegura desmontar todo con tiempo
    navigate("/");
  }, 50);
  };

  const goToPost =  () => {
    navigate("/post");
    localStorage.getItem("token");
    dispatch(changeMenuOption(1));
    localStorage.setItem("menuOption", 1);
  };

  const goToHome =  () => {
    navigate("/home");
    localStorage.getItem("token");
    dispatch(changeMenuOption(0));
    localStorage.setItem("menuOption", 0);
  };

  const goToProfile =  () => {
    navigate("/profile");
    localStorage.getItem("Token");
    dispatch(changeMenuOption(2));
    localStorage.setItem("menuOption", 2);
  };

  const goToGroupPage = () =>{
    navigate("/group")
    localStorage.getItem("token");
    dispatch(changeMenuOption(4))
    localStorage.setItem("menuOption", 4)
  }

  const goToRancking = () => {
    navigate("/ranking")
    localStorage.getItem("token");
    dispatch(changeMenuOption(5))
      localStorage.setItem("menuOption", 5)
  }

  useEffect(() => {
    const savedOption = localStorage.getItem("menuOption");
    if (savedOption) {
      dispatch(changeMenuOption(Number(savedOption)));
    }
  }, []);

  useEffect(() => {
  fetchNotifications(); // Carga notificaciones al inicio
}, []);

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

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
  goToGroupPage={goToGroupPage}
  goToRancking={goToRancking}
  menuOptionsHeader={menuOptionsHeader}
  notifications={notifications}          // <- PASAR
  unreadNotifications={unreadNotifications} // <- PASAR
  handleToggleNotifications={handleToggleNotifications} // <- PASAR
/>
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li><button className="btn btn-outline-light" onClick={goToPost}>Publicaciones</button></li>
                <li><button className="btn btn-outline-light" onClick={goToGroupPage}>Grupos</button></li>
                <li><button className="btn btn-outline-light" onClick={ goToRancking} >Ranking</button></li>
                <li><button className="btn btn-outline-light" onClick={goToProfile}>Perfil</button></li>
           <li style={{ position: "relative" }}>
  <button className="btn btn-outline-light position-relative" onClick={handleToggleNotifications}>
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
    <button
      className="btn btn-warning"
      onClick={() => navigate("/admin-panel")} // Cambia la ruta si es otra
    >
      Panel de Control
    </button>
  )}

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
  goToGroupPage={goToGroupPage}
  goToRancking={goToRancking}
  menuOptionsHeader={menuOptionsHeader}
  notifications={notifications}          // <- PASAR
  unreadNotifications={unreadNotifications} // <- PASAR
  handleToggleNotifications={handleToggleNotifications} // <- PASAR
/>
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li><button className="btn btn-outline-light" onClick={goToHome}>Home</button></li>
                <li><button className="btn btn-outline-light" onClick={goToGroupPage}>Grupos</button></li>
                <li><button className="btn btn-outline-light" onClick={ goToRancking}>Ranking</button></li>
                <li><button className="btn btn-outline-light" onClick={goToProfile}>Perfil</button></li>
       <li style={{ position: "relative" }}>
  <button className="btn btn-outline-light position-relative" onClick={handleToggleNotifications}>
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
    <button
      className="btn btn-warning"
      onClick={() => navigate("/admin-panel")} // Cambia la ruta si es otra
    >
      Panel de Control
    </button>
  )}

  <img
    className="headerImage rounded-circle border border-light"
    src={user.user?.photoProfile?.trim() || "/public/images/ImgDefaultProfile.png"}
    alt="Perfil"
    style={{ width: "40px", height: "40px", objectFit: "cover" }}
  />
  <button className="btn btn-danger" onClick={logOut}>Cerrar Sesión</button>
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
  goToGroupPage={goToGroupPage}
  goToRancking={goToRancking}
  menuOptionsHeader={menuOptionsHeader}
  notifications={notifications}          // <- PASAR
  unreadNotifications={unreadNotifications} // <- PASAR
  handleToggleNotifications={handleToggleNotifications} // <- PASAR
/>
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li><button className="btn btn-outline-light" onClick={goToHome}>Home</button></li>
                <li><button className="btn btn-outline-light" onClick={goToPost}>Publicaciones</button></li>
                <li><button className="btn btn-outline-light" onClick={goToGroupPage}>Grupos</button></li>
                <li><button className="btn btn-outline-light" onClick={ goToRancking}>Ranking</button></li>
                  <li style={{ position: "relative" }}>
  <button className="btn btn-outline-light position-relative" onClick={handleToggleNotifications}>
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
    <button
      className="btn btn-warning"
      onClick={() => navigate("/admin-panel")} // Cambia la ruta si es otra
    >
      Panel de Control
    </button>
  )}

  <img
    className="headerImage rounded-circle border border-light"
    src={user.user?.photoProfile?.trim() || "/public/images/ImgDefaultProfile.png"}
    alt="Perfil"
    style={{ width: "40px", height: "40px", objectFit: "cover" }}
  />
  <button className="btn btn-danger" onClick={logOut}>Cerrar Sesión</button>
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
  goToGroupPage={goToGroupPage}
  goToRancking={goToRancking}
  menuOptionsHeader={menuOptionsHeader}
  notifications={notifications}          // <- PASAR
  unreadNotifications={unreadNotifications} // <- PASAR
  handleToggleNotifications={handleToggleNotifications} // <- PASAR
/>
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li><button className="btn btn-outline-light" onClick={goToHome}>Home</button></li>
                <li><button className="btn btn-outline-light" onClick={goToPost}>Publicaciones</button></li>
                <li><button className="btn btn-outline-light" onClick={goToGroupPage}>Grupos</button></li>
                <li><button className="btn btn-outline-light" onClick={goToProfile}>Perfil</button></li>
                <li><button className="btn btn-outline-light" onClick={ goToRancking}>Ranking</button></li>
                         <li style={{ position: "relative" }}>
  <button className="btn btn-outline-light position-relative" onClick={handleToggleNotifications}>
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
    <button
      className="btn btn-warning"
      onClick={() => navigate("/admin-panel")} // Cambia la ruta si es otra
    >
      Panel de Control
    </button>
  )}

  <img
    className="headerImage rounded-circle border border-light"
    src={user.user?.photoProfile?.trim() || "/public/images/ImgDefaultProfile.png"}
    alt="Perfil"
    style={{ width: "40px", height: "40px", objectFit: "cover" }}
  />
  <button className="btn btn-danger" onClick={logOut}>Cerrar Sesión</button>
</div>

        </header>
      ) : menuOptionsHeader === 4 ? (
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
  goToGroupPage={goToGroupPage}
  goToRancking={goToRancking}
  menuOptionsHeader={menuOptionsHeader}
  notifications={notifications}          // <- PASAR
  unreadNotifications={unreadNotifications} // <- PASAR
  handleToggleNotifications={handleToggleNotifications} // <- PASAR
/>
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li><button className="btn btn-outline-light" onClick={goToHome}>Home</button></li>
                <li><button className="btn btn-outline-light" onClick={goToPost}>Publicaciones</button></li>
                <li><button className="btn btn-outline-light" onClick={goToProfile}>Perfil</button></li>
                <li><button className="btn btn-outline-light"  onClick={goToRancking}>Rancking</button></li>
                             <li style={{ position: "relative" }}>
  <button className="btn btn-outline-light position-relative" onClick={handleToggleNotifications}>
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
    <button
      className="btn btn-warning"
      onClick={() => navigate("/admin-panel")} // Cambia la ruta si es otra
    >
      Panel de Control
    </button>
  )}

  <img
    className="headerImage rounded-circle border border-light"
    src={user.user?.photoProfile?.trim() || "/public/images/ImgDefaultProfile.png"}
    alt="Perfil"
    style={{ width: "40px", height: "40px", objectFit: "cover" }}
  />
  <button className="btn btn-danger" onClick={logOut}>Cerrar Sesión</button>
</div>

        </header>
      ) : menuOptionsHeader === 5 ? (
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
  goToGroupPage={goToGroupPage}
  goToRancking={goToRancking}
  menuOptionsHeader={menuOptionsHeader}
  notifications={notifications}          // <- PASAR
  unreadNotifications={unreadNotifications} // <- PASAR
  handleToggleNotifications={handleToggleNotifications} // <- PASAR
/>
          </div>

          <div className="d-none d-lg-block flex-grow-1">
            <nav className="nav justify-content-center">
              <ul className="d-flex gap-3 list-unstyled m-0">
                <li><button className="btn btn-outline-light" onClick={goToHome}>Home</button></li>
                <li><button className="btn btn-outline-light" onClick={goToPost}>Publicaciones</button></li>
                <li><button className="btn btn-outline-light" onClick={goToProfile}>Perfil</button></li>
                <li><button className="btn btn-outline-light" onClick={ goToGroupPage}>Grupos</button></li>
                           <li style={{ position: "relative" }}>
  <button className="btn btn-outline-light position-relative" onClick={handleToggleNotifications}>
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
    <button
      className="btn btn-warning"
      onClick={() => navigate("/admin-panel")} // Cambia la ruta si es otra
    >
      Panel de Control
    </button>
  )}

  <img
    className="headerImage rounded-circle border border-light"
    src={user.user?.photoProfile?.trim() || "/public/images/ImgDefaultProfile.png"}
    alt="Perfil"
    style={{ width: "40px", height: "40px", objectFit: "cover" }}
  />
  <button className="btn btn-danger" onClick={logOut}>Cerrar Sesión</button>
</div>

        </header>
      ) : (null)}
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
        <p className="text-muted text-center">No hay nuevas notificaciones.</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => handleNotificationClick(n._id)}
            className="border-bottom py-2 px-2 rounded"
            style={{ cursor: "pointer", transition: "background 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f1f1")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
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