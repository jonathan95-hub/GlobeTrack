import React from 'react'

const FooterComponent = () => {
  return (
    <div className='footer bg-dark d-flex justify-content-between flex-row '>
      <div className='ms-5'>
        <img className="footerImg "src="/src/assets/HeaderAndFooter/LogoGlobeTrack.svg" alt="" />
      </div>
      <div>
        <span className='text'>Explora, Conecta y vive</span>
      </div>
      <div className='me-5'>
        <img className="footerImg" src="/src/assets/HeaderAndFooter/LogoGlobeTrack.svg" alt="" />
      </div>
    </div>
  )
}

export default FooterComponent
 
    // <footer className="footer bg-dark text-light py-4 mt-auto">
    //   <div className="container">
    //     <div className="row text-center text-md-start align-items-center">
          
    //       {/* Logo o nombre */}
    //       <div className="col-12 col-md-4 mb-3 mb-md-0">
    //         <h5 className="fw-bold">🌍 GlobeTrack</h5>
    //         <p className="small mb-0">
    //           Conecta con viajeros y descubre nuevos destinos.
    //         </p>
    //       </div>

    //       {/* Enlaces */}
    //       <div className="col-12 col-md-4 mb-3 mb-md-0">
    //         <ul className="list-unstyled mb-0">
    //           <li><a href="#" className="text-light text-decoration-none">Inicio</a></li>
    //           <li><a href="#" className="text-light text-decoration-none">Destinos</a></li>
    //           <li><a href="#" className="text-light text-decoration-none">Sobre nosotros</a></li>
    //           <li><a href="#" className="text-light text-decoration-none">Contacto</a></li>
    //         </ul>
    //       </div>

    //       {/* Redes sociales */}
    //       <div className="col-12 col-md-4 d-flex justify-content-center justify-content-md-end gap-3">
    //         <a href="#" className="text-light fs-5"><i className="bi bi-facebook"></i></a>
    //         <a href="#" className="text-light fs-5"><i className="bi bi-instagram"></i></a>
    //         <a href="#" className="text-light fs-5"><i className="bi bi-twitter-x"></i></a>
    //       </div>
    //     </div>

    //     <hr className="border-light my-3" />

    //     <div className="text-center small">
    //       © {new Date().getFullYear()} GlobeTrack. Todos los derechos reservados.
    //     </div>
    //   </div>