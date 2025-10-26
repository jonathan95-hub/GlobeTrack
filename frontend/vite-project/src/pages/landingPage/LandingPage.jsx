import React, { useState } from 'react';
import RegisterComponent from '../../components/landingPage/RegisterComponent';
import LoginComponent from '../../components/landingPage/login/LoginComponent';

const LandingPage = () => {
  const [menuOptiosInit, setMenuOptionsInit] = useState("INIT");


  const register = () => setMenuOptionsInit("REGISTER");
  const login = () => setMenuOptionsInit("LOGIN");

  return (
    <>
    {menuOptiosInit === "INIT" ? (<div className="container-fluid containerLanding d-flex flex-column flex-md-row min-vh-100 p-0">
       
          <div className="text-section d-flex align-items-center justify-content-center text-center text-md-start p-4 col-12 col-md-6">
            <p className="paragraph-login">
              🌍 Explora el mundo con GlobeTrack. Descubre lugares increíbles y conecta con viajeros de cualquier parte del planeta. 
              ¿Buscas inspiración para tu próximo destino? En GlobeTrack, nuestra comunidad comparte experiencias, consejos y aventuras reales 
              para ayudarte a decidir dónde viajar. ¡Únete hoy y forma parte de la red social que une a los exploradores del mundo!
            </p>
          </div>

          <div className="image-section d-flex flex-column align-items-center justify-content-center col-12 col-md-6 p-4">
            <img
              src="src/assets/imageLandingPage/ImagenLandinPage.png"
              alt="Landing"
              className="img-fluid mb-3"
            />
            <div className="button-container d-flex flex-column flex-md-row gap-3 justify-content-center w-100">
              <button className="btn-custom" onClick={login}>Iniciar sesión</button>
              <button className="btn-custom" onClick={register}>Registrate</button>
            </div>
          </div>
        </div>) : menuOptiosInit === "REGISTER" ? (<div className="container-fluid d-flex flex-column flex-md-row min-vh-100 p-0">
          <div className="text-section d-flex align-items-center justify-content-center text-center text-md-start p-4 col-12 col-md-6">
            <p className="paragraph-login">
              🌍 Explora el mundo con GlobeTrack. Descubre lugares increíbles y conecta con viajeros de cualquier parte del planeta. 
              ¿Buscas inspiración para tu próximo destino? En GlobeTrack, nuestra comunidad comparte experiencias, consejos y aventuras reales 
              para ayudarte a decidir dónde viajar. ¡Únete hoy y forma parte de la red social que une a los exploradores del mundo!
            </p>
          </div>
          <div className="d-flex align-items-center justify-content-center col-12 col-md-6 p-4">
            <RegisterComponent setMenuOptionsInit={setMenuOptionsInit}/>
          </div>
        </div>) : menuOptiosInit === "LOGIN" ? (
           <div className="container-fluid d-flex flex-column flex-md-row min-vh-100 p-0">
          <div className="text-section d-flex align-items-center justify-content-center text-center text-md-start p-4 col-12 col-md-6">
            <p className="paragraph-login">
              🌍 Explora el mundo con GlobeTrack. Descubre lugares increíbles y conecta con viajeros de cualquier parte del planeta. 
              ¿Buscas inspiración para tu próximo destino? En GlobeTrack, nuestra comunidad comparte experiencias, consejos y aventuras reales 
              para ayudarte a decidir dónde viajar. ¡Únete hoy y forma parte de la red social que une a los exploradores del mundo!
            </p>
          </div>
          <div className="d-flex align-items-center justify-content-center col-12 col-md-6 p-4">
            <LoginComponent />
          </div>
        </div>
        ) : (null)}
     
    </>
  );
};

export default LandingPage;

