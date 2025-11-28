import React, { useState } from 'react';
// Componentes para registro e inicio de sesión
import RegisterComponent from '../../components/landingPage/RegisterComponent';
import LoginComponent from '../../components/landingPage/login/LoginComponent';
import 'bootstrap/dist/css/bootstrap.min.css';

const LandingPage = () => {
  // Estado para controlar qué vista mostrar: INIT, REGISTER o LOGIN
  const [menuOptiosInit, setMenuOptionsInit] = useState("INIT");

   // Funciones para cambiar la vista
  const register = () => setMenuOptionsInit("REGISTER"); // Mostrar formulario de registro
  const login = () => setMenuOptionsInit("LOGIN");       // Mostrar formulario de login

  return (
    <>
      {menuOptiosInit === "INIT" ? (
        <div className="container-fluid d-flex flex-column flex-md-row min-vh-100 p-0">
          {/* Sección de texto  */}
          <div
            className="text-section d-flex flex-column align-items-center justify-content-center text-center text-md-start col-12 col-md-6 p-5 text-white"
            style={{
              background: "linear-gradient(135deg, #0077b6, #00b4d8, #90e0ef)",
            }}
          >
            <h1 className="fw-bold mb-4 display-5">
              Bienvenido a GlobeTrack 🌍
            </h1>
            <p className="paragraph-login fs-5 lh-base">
              Descubre lugares increíbles y conecta con viajeros de todo el planeta.
              <br /><br />
              En GlobeTrack compartimos experiencias, consejos y aventuras reales
              para ayudarte a decidir tu próximo destino.
              <br /><br />
              ¡Únete hoy y forma parte de la comunidad que une a los exploradores del mundo!
            </p>
          </div>

          {/* Sección de imagen y  botones  */}
          <div
            className="image-section d-flex flex-column align-items-center justify-content-center col-12 col-md-6 p-5"
            style={{
              backgroundColor: "#fff4e6",
            }}
          >
            <img
              src="src/assets/imageLandingPage/ImagenLandinPage.png"
              alt="Explora el mundo"
              className="img-fluid rounded-4 shadow-sm mb-4"
              style={{ maxWidth: "85%", height: "auto", objectFit: "cover" }}
            />
            <div className="button-container d-flex flex-column flex-md-row gap-3 justify-content-center w-100 mt-3">
              <button
                className="btn btn-primary px-4 py-2 rounded-3 fw-semibold shadow-sm"
                style={{ backgroundColor: "#0077b6", borderColor: "#0077b6" }}
                onClick={login}
              >
                Iniciar sesión
              </button>
              <button
                className="btn px-4 py-2 rounded-3 fw-semibold shadow-sm"
                style={{
                  color: "#0077b6",
                  border: "2px solid #0077b6",
                  backgroundColor: "transparent",
                }}
                onClick={register}
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      ) : menuOptiosInit === "REGISTER" ? (
        <div className="container-fluid d-flex flex-column flex-md-row min-vh-100 p-0">
          {/* 🌅 Texto lateral con fondo azul suave */}
          <div
            className="text-section d-flex align-items-center justify-content-center text-center text-md-start col-12 col-md-6 p-5 text-white"
            style={{
              background: "linear-gradient(135deg, #00b4d8, #0077b6)",
            }}
          >
            <div>
              <h2 className="fw-bold mb-4">Únete a GlobeTrack</h2>
              <p className="fs-5">
                Crea tu cuenta y empieza a explorar el mundo con viajeros que comparten tus mismas pasiones.
              </p>
            </div>
          </div>

          {/*  Formulario */}
          <div
            className="d-flex align-items-center justify-content-center col-12 col-md-6 p-4"
            style={{ backgroundColor: "#fffaf2" }}
          >
            <RegisterComponent setMenuOptionsInit={setMenuOptionsInit} />
          </div>
        </div>
      ) : menuOptiosInit === "LOGIN" ? (
        <div className="container-fluid d-flex flex-column flex-md-row min-vh-100 p-0">
          {/*  Texto lateral  */}
          <div
            className="text-section d-flex align-items-center justify-content-center text-center text-md-start col-12 col-md-6 p-5 text-white"
            style={{
              background: "linear-gradient(135deg, #0077b6, #0096c7)",
            }}
          >
            <div>
              <h2 className="fw-bold mb-4">Bienvenido de nuevo 🌎</h2>
              <p className="fs-5">
                Inicia sesión para continuar compartiendo tus viajes y descubrir nuevas aventuras alrededor del mundo.
              </p>
            </div>
          </div>

          {/*  Formulario de login  */}
          <div
            className="d-flex align-items-center justify-content-center col-12 col-md-6 p-4"
            style={{ backgroundColor: "#fff4e6" }}
          >
            <LoginComponent setMenuOptionsInit={setMenuOptionsInit} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default LandingPage;
