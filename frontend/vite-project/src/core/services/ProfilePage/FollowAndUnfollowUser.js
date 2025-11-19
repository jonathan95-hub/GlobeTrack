import { apiFetch } from "../apiFetch/apiFetch";

export const followAndUnfollow = async (userId) => {
   
    const data = await apiFetch(`http://localhost:3000/user/${userId}/follow`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        }
       
    })
    
    return data
}