// Importamos la función apiFetch que creamos para hacer peticiones al backend
import { apiFetch } from "../apiFetch/apiFetch"

// Creamos una función asíncrona llamada allGroup para obtener todos los grupos
export const allGroup = async () => {

    // Llamamos a la API usando nuestra función apiFetch
    // Le pasamos la URL de nuestro endpoint que devuelve todos los grupos
    // Y le indicamos que es un método GET y que los headers serán tipo JSON
    const data = await apiFetch("http://localhost:3000/group/all", {
        method: 'GET',
        headers: {
            "Content-Type": "application/json", // Indicamos que esperamos recibir JSON
        }
    })

    // Retornamos los datos que nos da la API para que puedan ser usados en el frontend
    return data
}
