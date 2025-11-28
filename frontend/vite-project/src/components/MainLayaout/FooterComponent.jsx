import React from 'react'

const FooterComponent = () => {
  return (
    <footer className="footer bg-primary text-light py-4 mt-auto shadow-lg border-top border-primary">
      <div className="container-fluid d-flex flex-column flex-md-row justify-content-center align-items-center text-center px-3 gap-2">
        
        {/* Texto */}
        <div className="flex-grow-1">
          <span className="fw-semibold fs-5 text-uppercase  d-block">
            Explora, Conecta y Vive 
          </span>
          <small className="text-dark d-block mt-2">
            © {new Date().getFullYear()} GlobeTracked. Todos los derechos reservados.
          </small>
        </div>

      </div>
    </footer>
  )
}

export default FooterComponent
