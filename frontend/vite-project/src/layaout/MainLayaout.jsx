import React from 'react'
import HeadersComponent from '../components/MainLayaout/Header/HeadersComponent'
import FooterComponent from '../components/MainLayaout/FooterComponent'

const MainLayaout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <HeadersComponent />

      {/* Contenido principal */}
      <main className="flex-grow-1">
        {children}
      </main>

      {/* Footer */}
      <FooterComponent />
    </div>
  )
}

export default MainLayaout
