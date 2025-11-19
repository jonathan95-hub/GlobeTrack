import { apiFetch } from "../apiFetch/apiFetch";


export const deletePhotRanking = async(photoId) => {
  
    const data = await apiFetch(`http://localhost:3000/ranking/delete/${photoId}`,{
        method: 'DELETE',
        headers:{
            "Content-Type": "application/json"
        }
    })

    
    return data
}