import { LOGIN, LOG_OUT } from "./loginAction";

const token = localStorage.getItem('token');
const initialState = {
    isLogued: !!token, // La doble negación hace que si hay token mantenga la sesion abierta si no lo hay te manda de vuelta al login
    user: null
}

const loginReducer = (state = initialState, action) => {
const{type, payload} = action
switch(type){
    case LOGIN:
        return{
            ...state, 
            isLogued: true,
            user: payload
        }
    case LOG_OUT:
        return{
            ...state,
            isLogued: false,
            user: null
            }
    default:
        return state
}
}

export default loginReducer