// Importamos la función apiFetch que centraliza las peticiones al backend
// Incluye manejo de tokens, reintentos y errores
import { apiFetch } from "../apiFetch/apiFetch"

// Función para eliminar un usuario específico según su ID
export const deleteUser = async (userId) => {

    // Llamamos a la API usando apiFetch
    // Usamos template string para incluir el userId en la URL
    const data = await apiFetch(`http://localhost:3000/user/delete/${userId}`, {
        method: 'DELETE', // Método HTTP DELETE porque queremos eliminar un recurso
        headers: {        // Cabeceras HTTP
            "Content-Type": "application/json" // Indicamos que trabajamos con JSON
        }
    })

    // Devolvemos la respuesta de la API para que quien llame a la función pueda manejarla
    return data
}
