import React, { useState } from 'react'
import {Route, Routes, Navigate} from 'react-router'
import LandingPage from '../../pages/landingPage/LandingPage'
import MainLayaout from '../../layaout/MainLayaout'
import HomePage from '../../pages/HomePage/HomePage'
import { useSelector } from 'react-redux'
const OwnRouter = () => {
  const{isLogued} = useSelector(state => state.loginReducer)
  
  return (
    <div>
      <Routes>
    <Route path='/' element={<LandingPage/>}/>
    <Route path='/home' element={isLogued ? (<MainLayaout><HomePage/></MainLayaout>) : (<Navigate to="/" replace/>)}/>
      </Routes>
    </div>
  )
}

export default OwnRouter
