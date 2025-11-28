// Definimos constantes para los tipos de acción en Redux
// Esto ayuda a no cometer errores con los nombres de las acciones
export const LOGIN = "LOGIN"          // Acción para iniciar sesión
export const LOG_OUT = "LOG_OUT"      // Acción para cerrar sesión
export const UPDATE_USER = "UPDATE_USER"  // Acción para actualizar información del usuario

// Acción para hacer login
// 'payload' contiene la información del usuario y tokens
export const doLoginAction = (payload) => {
  // Guardamos los tokens y la info del usuario en localStorage
  // Esto permite mantener la sesión aunque se recargue la página
  localStorage.setItem('token', payload.token)
  localStorage.setItem('token_refresh', payload.token_refresh)
  localStorage.setItem('user', JSON.stringify(payload.user))

  // Retornamos un objeto de acción que Redux puede usar
  // type: indica el tipo de acción
  // payload: los datos que se envían al reducer
  return {
    type: LOGIN,
    payload
  }
}

// Acción para cerrar sesión
// Puede usarse para limpiar el estado global y cerrar sesión
export const doLoginOutAction = (payload) => {
  return {
    type: LOG_OUT,
    payload
  }
}

// Acción para actualizar los datos del usuario
// payload contiene la nueva información del usuario
export const updateUser = (payload) => {
  return {
    type: UPDATE_USER,
    payload
  }
}
