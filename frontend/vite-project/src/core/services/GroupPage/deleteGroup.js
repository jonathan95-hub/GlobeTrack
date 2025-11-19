import { apiFetch } from "../apiFetch/apiFetch"


export const deleteMygroup = async (groupId) => {
   
    const data = await apiFetch(`http://localhost:3000/group/delete/${groupId}`,{
        method: 'DELETE',
        headers:{
              "Content-Type": "application/json",
        }
    })
  
    return data
}