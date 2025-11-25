import { apiFetch } from "../apiFetch/apiFetch"

export const allGroup = async() => {
    
    const data = await apiFetch("http://localhost:3000/group/all",{
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            
        }
    })
    return data
}