import { apiFetch } from "../apiFetch/apiFetch";


export const getMessagePrivate = async () => {

    const data = await apiFetch(`http://localhost:3000/privatemessage/obtainedmessage`,{
        method: 'GET',
        headers:{
            "Content-Type": "application/json"
        },
        
    })
   
    return data
}

export const sendMessagesPrivates = async(receptorUserId, content) => {
  
    const data = await apiFetch(`http://localhost:3000/privatemessage/sendprivate/${receptorUserId}`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({content})
    })
    
    return data
}