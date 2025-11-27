// Importamos combineReducers de redux para unir varios reducers
import { combineReducers } from 'redux'

// Importamos los reducers 
import loginReducer from '../../../components/landingPage/login/loginReducer' // Estado del login
import menuReducerHeader from "../../../components/MainLayaout/Header/headerReducer" // Estado del header/menu

// Unimos todos los reducers en uno solo
const reducers = combineReducers({
    loginReducer,       // Reducer que maneja todo lo relacionado con login
    menuReducerHeader   // Reducer que maneja todo lo relacionado con el header del layout
})

// Exportamos los reducers combinados para usarlos en el store de Redux
export default reducers
