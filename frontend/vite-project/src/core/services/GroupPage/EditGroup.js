import { apiFetch } from "../apiFetch/apiFetch";

export const editGroup = async(groupId, {name, photoGroup, description}) => {

    const data = await apiFetch(`http://localhost:3000/group/edit/${groupId}`,{
        method: 'PATCH',
        headers:{
            "Content-Type": "application/json",
            
        },
        body: JSON.stringify({name, photoGroup, description})
    })
   
    return data
}