import React from 'react'
import HeadersComponent from '../components/MainLayaout/Header/HeadersComponent'
import FooterComponent from '../components/MainLayaout/FooterComponent'

const MainLayaout = ({ children }) => {
  //  Este componente lo pondremos en todas las paginas de la web 
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <HeadersComponent />

      {/* Componente que se visualiza */}
      <main className="flex-grow-1">
        {children}
      </main>

      {/* Footer */}
      <FooterComponent />
    </div>
  )
}

export default MainLayaout
