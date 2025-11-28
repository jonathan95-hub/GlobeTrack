import { apiFetch } from "../apiFetch/apiFetch";

export const allUser = async () => {
    // Llamamos a nuestra función apiFetch pasando la URL del endpoint que devuelve los logs
    // Indicamos que es un método GET y que esperamos trabajar con JSON
     const data = await apiFetch("http://localhost:3000/user/all",{
        method: 'GET',
        headers:{
            "Content-Type": "application/json"
        }
     })
     return data
}