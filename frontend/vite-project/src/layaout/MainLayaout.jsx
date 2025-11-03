import React from 'react'
import HeadersComponent from '../components/MainLayaout/Header/HeadersComponent'
import FooterComponent from '../components/MainLayaout/FooterComponent'

const MainLayaout = (props) => {
    const{children} = props
  return (
    <div>
      <HeadersComponent/>
      {children}
      <FooterComponent/>
    </div>
  )
}

export default MainLayaout
