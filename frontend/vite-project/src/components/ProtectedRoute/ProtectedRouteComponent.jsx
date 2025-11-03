// src/components/ProtectedRoute/ProtectedRouteComponent.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'

const ProtectedRouteComponent = ({ children }) => {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/" replace />
  }

  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000 // en segundos

    // Si ya expiró
    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.removeItem('token')
      return <Navigate to="/" replace />
    }
  } catch (error) {
    // Token inválido o corrupto
    localStorage.removeItem('token')
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRouteComponent
