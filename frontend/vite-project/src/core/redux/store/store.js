// Importamos createStore de redux para crear el store
// Usamos legacy_createStore porque es la versión antigua de redux
import { legacy_createStore as createStore } from 'redux'

// Importamos los reducers 
import reducers from '../reducer'

// Creamos el store de 
// El store es donde se guarda todo el estado  de la app
const store = createStore(reducers)

// Exportamos el store para poder usarlo en toda la aplicación
export default store
