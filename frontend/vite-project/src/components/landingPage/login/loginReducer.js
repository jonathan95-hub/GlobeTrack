import { useSelector } from "react-redux"; // Importamos useSelector de Redux (aunque no se usa aquí directamente)
import { LOGIN, LOG_OUT, UPDATE_USER } from "./loginAction"; // Importamos las acciones definidas anteriormente

// Obtenemos el token guardado en localStorage
const token = localStorage.getItem('token'); 

// Obtenemos los datos del usuario guardados en localStorage
const userStorage = localStorage.getItem("user"); 

// Estado inicial del reducer
const initialState = {
    // isLogued será true si hay token, false si no hay
    isLogued: !!token, // la doble negación convierte el token a true o false

    // user se inicializa con los datos guardados si existen, sino null
    user: userStorage ? JSON.parse(userStorage) : null 
}

// Reducer que maneja el estado de login
const loginReducer = (state = initialState, action) => {
    const { type, payload } = action; // Desestructuramos type y payload de la acción

    switch(type){
        case LOGIN:
            // Cuando hacemos login:
            return {
                ...state, // Mantenemos el estado previo
                isLogued: true, // Marcamos que está logueado
                user: payload.user, // Guardamos los datos del usuario
                token: payload.token, // Guardamos el token
                token_refresh: payload.token_refresh, // Guardamos el token de refresco
                isAdmin: payload.isAdmin // Guardamos si es admin
            }

        case LOG_OUT:
            // Cuando cerramos sesión:
            // Borramos los datos guardados en localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("token_refresh");
            localStorage.removeItem("user");
            return {
                ...state,
                isLogued: false, // Marcamos que no está logueado
                user: null // Limpiamos los datos del usuario
            }

        case UPDATE_USER:
            // Cuando se actualizan los datos del usuario:
            localStorage.setItem("user", JSON.stringify(payload)); // Guardamos los nuevos datos en localStorage
            return {
                ...state,
                user: payload // Actualizamos el usuario en el estado
            }

        default:
            // Si la acción no coincide con nada, devolvemos el estado actual
            return state;
    }
}

export default loginReducer; // Exportamos el reducer para usarlo en el store
