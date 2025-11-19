import { apiFetch } from "../apiFetch/apiFetch";


export const getMessageGroup = async(groupId) => {
    const data = await apiFetch(`http://localhost:3000/groupmessage/getmessage/${groupId}`,{
        method: 'GET',
        headers:{
            "Content-Type": "application/json"
        }
    })

    return data
}


export const sendMessageGroup = async(groupId, content) => {
 
    const data = await apiFetch(`http://localhost:3000/groupmessage/send/${groupId}`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(content)
    })
    
    return data
}