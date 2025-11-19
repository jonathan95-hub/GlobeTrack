import { apiFetch } from "../apiFetch/apiFetch";


export const enterGroupAndExitGroup = async (groupId) => {

    const data = await apiFetch(`http://localhost:3000/group/addandexit/${groupId}`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
           
        },
        
    })
   
    return data
}
