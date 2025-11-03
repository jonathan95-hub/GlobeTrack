import React, { useState } from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import LandingPage from '../../pages/landingPage/LandingPage'
import MainLayaout from '../../layaout/MainLayaout'
import HomePage from '../../pages/HomePage/HomePage'
import PostPage from '../../pages/PostPage/PostPage'
import ProtectedRouteComponent from '../../components/ProtectedRoute/ProtectedRouteComponent'

import { useSelector } from 'react-redux'
const OwnRouter = () => {
  const{isLogued} = useSelector(state => state.loginReducer)
  
  return (
    <div>
      <Routes>
    <Route path='/' element={<LandingPage/>}/>
    <Route path='/home' element={isLogued ? (<ProtectedRouteComponent><MainLayaout><HomePage/></MainLayaout></ProtectedRouteComponent>) : (<Navigate to="/" replace/>)}/>
    <Route path='/post' element={isLogued ? (<ProtectedRouteComponent><MainLayaout><PostPage/></MainLayaout></ProtectedRouteComponent>) : (<Navigate to="/" replace/>)} />
      </Routes>
    </div>
  )
}

export default OwnRouter
