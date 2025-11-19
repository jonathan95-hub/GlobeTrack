import { apiFetch } from "../apiFetch/apiFetch";


export const votePhoto = async(photoId) => {
   
    const data = await apiFetch(`http://localhost:3000/ranking/${photoId}`, {
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        }
    })
    
    return data
}