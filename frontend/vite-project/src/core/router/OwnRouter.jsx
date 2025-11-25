import React, { useState } from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import LandingPage from '../../pages/landingPage/LandingPage'
import MainLayaout from '../../layaout/MainLayaout'
import HomePage from '../../pages/HomePage/HomePage'
import PostPage from '../../pages/PostPage/PostPage'
import ProtectedRouteComponent from '../../components/ProtectedRoute/ProtectedRouteComponent'
import ProfilePage from '../../pages/ProfilePage/ProfilePage'
import CommentComponent from '../../components/PostPage/commentComponent'

import { useSelector } from 'react-redux'
import MessagePrivate from '../../components/Profile/MessagePrivate/MessagePrivate'
import GroupPage from '../../pages/GroupPage/GroupPage'
import CreateGroupComponent from '../../components/GroupPage/CreateGroupComponent'
import ChatGroup from '../../components/GroupPage/ChatGroup'
import CreateCommentComponent from '../../components/PostPage/createComment'
import RanckingPage from '../../pages/RankingPage/RanckingPage'
import ControlPanel from '../../pages/controlPanel/ControlPanel'

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
    <Route path='/group' element={isLogued ? (<ProtectedRouteComponent><MainLayaout><GroupPage/></MainLayaout></ProtectedRouteComponent>) : (<Navigate to="" replace/>)} />
    <Route path='/group/create' element={isLogued ? (<ProtectedRouteComponent><MainLayaout><CreateGroupComponent/></MainLayaout></ProtectedRouteComponent>) : (<Navigate to="" replace/>)} />
    <Route path='/group/chat/:groupId' element={isLogued ? (<ProtectedRouteComponent><MainLayaout><ChatGroup/></MainLayaout></ProtectedRouteComponent>) : (<Navigate to="" replace/>)} />
    <Route path='/post/comment' element={isLogued ? (<ProtectedRouteComponent><MainLayaout><CommentComponent/></MainLayaout></ProtectedRouteComponent>) : (<Navigate to="" replace/>)} />
    <Route path='/post/comment/create' element={isLogued ? (<ProtectedRouteComponent><MainLayaout><CreateCommentComponent/></MainLayaout></ProtectedRouteComponent>) : (<Navigate to="" replace/>)} />
    <Route path='/ranking' element={isLogued ? (<ProtectedRouteComponent><MainLayaout><RanckingPage/></MainLayaout></ProtectedRouteComponent>) : (<Navigate to="" replace/>)} />
    <Route path='/control' element={isLogued ? (<ProtectedRouteComponent><MainLayaout><ControlPanel/></MainLayaout></ProtectedRouteComponent>) : (<Navigate to="" replace/>)} />

      </Routes>
    </div>
  )
}

export default OwnRouter
