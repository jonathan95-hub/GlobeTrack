import { apiFetch } from "../apiFetch/apiFetch"

export const getAllLog = async() => {
   const data = await apiFetch("http://localhost:3000/audit/allLog",{
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            
        }
    })
    return data
}