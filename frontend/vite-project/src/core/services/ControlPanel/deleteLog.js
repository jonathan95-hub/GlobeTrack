// Importamos la función apiFetch que maneja las peticiones al backend, incluyendo el token y errores
import { apiFetch } from "../apiFetch/apiFetch";

// Función para eliminar todos los logs del sistema
export const deleteAllLog = async () => {
    // Llamamos a la API usando apiFetch con método DELETE
    const data = await apiFetch("http://localhost:3000/audit/delete/allLog", {
        method: 'DELETE', // Método HTTP DELETE para eliminar recursos
        headers: {        // Cabeceras HTTP, indicando que trabajamos con JSON
            "Content-Type": "application/json"
        }
    });

    // Devolvemos la respuesta de la API
    return data;
}

// Función para eliminar solo los logs de tipo Warning
export const deletedWarning = async () => {
    const data = await apiFetch("http://localhost:3000/audit/delete/logWarn", {
        method: 'DELETE',
        headers: { 
            "Content-Type": "application/json"
        }
    });
    return data;
}

// Función para eliminar solo los logs de tipo Error
export const deletedError = async () => {
    const data = await apiFetch("http://localhost:3000/audit/delete/logError", {
        method: 'DELETE',
        headers: { 
            "Content-Type": "application/json"
        }
    });
    return data;
}

// Función para eliminar solo los logs de tipo Info
export const deletedInfo = async () => {
    const data = await apiFetch("http://localhost:3000/audit/delete/logInfo", {
        method: 'DELETE',
        headers: { 
            "Content-Type": "application/json"
        }
    });
    return data;
}
