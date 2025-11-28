// Importamos la constante de acción para cambiar la opción del menú
import { CHANGE_MENU } from "../Header/headerAction"

// Estado inicial del reducer, empezamos con la opción 0
const initialState = {
    menuOptionsHeader: 0, // Valor por defecto del menú
}

// Reducer que maneja el estado del menú del header
const menuReducerHeader = (state = initialState, action) => {
  // Si la acción es CHANGE_MENU
  if (action.type === CHANGE_MENU) {
    return {
      ...state, // Mantenemos el estado anterior
      menuOptionsHeader: action.payload, // Actualizamos la opción del menú con el payload
    };
  } else {
    // Si no es la acción que nos interesa, retornamos el estado actual
    return state;
  }
};

// Exportamos el reducer para combinarlo en el store
export default menuReducerHeader;
