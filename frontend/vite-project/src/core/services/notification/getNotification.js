import { apiFetch } from "../apiFetch/apiFetch"

export const getNotification = async() => {
  
    const data = await apiFetch(`http://localhost:3000/notification/new`,{
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        
        }
    })
   
    return data
}