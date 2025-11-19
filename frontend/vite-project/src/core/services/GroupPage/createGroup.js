import { apiFetch } from "../apiFetch/apiFetch";


export const createNewGroup = async (name, photoGroup, description) => {
    
    const data = await apiFetch("http://localhost:3000/group/newgroup",{
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            
        },
        body: JSON.stringify({name, photoGroup, description})
    })
   
    return data
}