// Importamos la función apiFetch que centraliza las peticiones al backend
import { apiFetch } from "../apiFetch/apiFetch"

// Creamos una función asíncrona llamada getAllLog para obtener todos los logs de auditoría
export const getAllLog = async () => {

    // Llamamos a nuestra función apiFetch pasando la URL del endpoint que devuelve los logs
    // Indicamos que es un método GET y que esperamos trabajar con JSON
    const data = await apiFetch("http://localhost:3000/audit/allLog", {
        method: 'GET',
        headers: {
            "Content-Type": "application/json", // Aclaramos que la respuesta será JSON
        }
    })

    // Devolvemos los datos obtenidos para poder utilizarlos en el frontend
    return data
}
