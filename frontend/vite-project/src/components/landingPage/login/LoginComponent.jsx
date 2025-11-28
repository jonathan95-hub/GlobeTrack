// Importamos React y hooks necesarios
import React, { useState } from 'react'
// Importamos hooks de Redux
import { useDispatch, useSelector } from 'react-redux'
// Importamos función para hacer login al backend
import { loginFetch } from '../../../core/services/landinPage/loginFecth'
// Importamos acción de login para actualizar el estado global
import { doLoginAction } from './loginAction'
// Importamos hook para navegar entre rutas
import { useNavigate } from 'react-router-dom'
// Importamos acción para cambiar la opción de menú en el header
import { changeMenuOption } from '../../MainLayaout/Header/headerAction'

// Componente de login
const LoginComponent = ({ setMenuOptionsInit }) => {

  const dispatch = useDispatch() // Para usar Redux
  const navigate = useNavigate() // Para navegar entre páginas

  // Estados locales para guardar email y password
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Obtenemos el estado actual del menú (aunque no se usa en este componente)
  const { menuOptionsHeader } = useSelector((state) => state.menuReducerHeader)

  // Función que se ejecuta al hacer login
  const login = async () => {
    try {
      // Llamamos al backend para iniciar sesión
      const user = await loginFetch(email, password)

      // Si obtenemos token y el refresh_token, lo guardamos en localStorage
      if (user.token) {
        localStorage.setItem('token', user.token)
        localStorage.setItem('token_refresh', user.token_refresh)
      }

      // Actualizamos el estado global con la información del usuario
      dispatch(doLoginAction(user))

      // Navegamos al home
      navigate('/home')

      // Cambiamos la opción del menú a la opción 0 (inicio)
      dispatch(changeMenuOption(0))
      localStorage.setItem('menuOption', 0)

      console.log('Login exitoso:', user)

    } catch (error) {
      // Mostramos error si algo falla
      console.error('Error de login:', error.message)
      alert(error.message)
    }
  }

  // Función para volver a la landingPage
  const backToLanding = () => {
    setMenuOptionsInit('INIT')
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 px-3">
      {/* Tarjeta central del formulario */}
      <div
        className="card shadow-lg border-0 rounded-4 p-4 p-md-5"
        style={{ maxWidth: '420px', width: '100%' }}
      >
        <h3 className="text-center mb-4 fw-bold text-primary">Iniciar sesión</h3>

        {/* Input para email */}
        <div className="form-group mb-3">
          <label className="fw-semibold text-secondary">Correo electrónico</label>
          <input
            type="email"
            className="form-control rounded-3"
            placeholder="Introduce tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Input para contraseña */}
        <div className="form-group mb-4">
          <label className="fw-semibold text-secondary">Contraseña</label>
          <input
            type="password"
            className="form-control rounded-3"
            placeholder="Introduce tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Botones */}
        <div className="d-flex flex-column gap-3">
          <button
            className="btn btn-primary w-100 rounded-3 fw-semibold shadow-sm"
            onClick={login} // Llama a la función de login
          >
            Acceder
          </button>
          <button
            className="btn btn-outline-primary w-100 rounded-3 fw-semibold"
            onClick={backToLanding} // Vuelve a la pantalla de inicio
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  )
}

export default LoginComponent
