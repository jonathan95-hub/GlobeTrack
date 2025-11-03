import { LOGIN, LOG_OUT } from "./loginAction";

const token = localStorage.getItem('token'); // Obtenemos el token del locarStorage
const userStorage = localStorage.getItem("user") // Obtenemos el usuario del localStorage
const initialState = {
    isLogued: !!token, // La doble negación hace que si hay token mantenga la sesion abierta si no lo hay te manda de vuelta al login
    user: userStorage ? JSON.parse(userStorage) : null //Si hay datos del usuario guardados, los convertimos de texto a objeto con JSON.parse Si no hay nada, el usuario empieza en null
}

const loginReducer = (state = initialState, action) => {
const{type, payload} = action
switch(type){
    case LOGIN:
        return{
            ...state, 
            isLogued: true,
            user: payload.user,
            token: payload.token,
            token_refresh: payload.token_refresh
        }
    case LOG_OUT:
        // Al cerrar sesion borramos el token el token de refresco y el usuario del localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("token_refresh");
      localStorage.removeItem("user");
        return{
            ...state,
            isLogued: false, // Ponemos is logued en false
            user: null // Ponemos user en null
            }
    default:
        return state
}
}

export default loginReducer