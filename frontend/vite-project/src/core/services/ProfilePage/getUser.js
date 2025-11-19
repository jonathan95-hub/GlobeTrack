import { apiFetch } from "../apiFetch/apiFetch";

export const getInfoUser = async(userId) => {

    const data = await apiFetch(`http://localhost:3000/user/${userId}`,{
        method: 'GET',
        headers:{
            "Content-Type": "application/json"
        }
    })
    
    return data
}