import React, { useState } from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import LandingPage from '../../pages/landingPage/LandingPage'
import MainLayaout from '../../layaout/MainLayaout'
import HomePage from '../../pages/HomePage/HomePage'
import PostPage from '../../pages/PostPage/PostPage'
import ProtectedRouteComponent from '../../components/ProtectedRoute/ProtectedRouteComponent'
import ProfilePage from '../../pages/ProfilePage/ProfilePage'

import { useSelector } from 'react-redux'
import MessagePrivate from '../../components/Profile/MessagePrivate/MessagePrivate'

const OwnRouter = () => {
  const{isLogued} = useSelector(state => state.loginReducer)
  
  return (
    <div>
      <Routes>
    <Route path='/' element={<LandingPage/>}/>
    <Route path='/home' element={isLogued ? (<ProtectedRouteComponent><MainLayaout><HomePage/></MainLayaout></ProtectedRouteComponent>) : (<Navigate to="/" replace/>)}/>
    <Route path='/post' element={isLogued ? (<ProtectedRouteComponent><MainLayaout><PostPage/></MainLayaout></ProtectedRouteComponent>) : (<Navigate to="/" replace/>)} />
    <Route path='/profile' element={isLogued ? (<ProtectedRouteComponent><MainLayaout><ProfilePage/></MainLayaout></ProtectedRouteComponent>) : (<Navigate to="/" replace/>)} />
    <Route path='/message' element={isLogued ? (<ProtectedRouteComponent><MainLayaout><MessagePrivate/></MainLayaout></ProtectedRouteComponent>) : (<Navigate to="" replace/>)} />

      </Routes>
    </div>
  )
}

export default OwnRouter
