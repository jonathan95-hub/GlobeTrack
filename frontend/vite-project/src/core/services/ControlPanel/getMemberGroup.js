import { apiFetch } from "../apiFetch/apiFetch"

export const membersGroup = async(groupId) => {
    const data = await apiFetch(`http://localhost:3000/group/totalmembers/${groupId}`,{
        method: 'GET',
        headers:{
            "Content-Type": "application/json"
        }
    })
    return data
}

export const expel = async (groupId, userIdToRemove) => {
       const data = await apiFetch(`http://localhost:3000/group/expelmember/${groupId}/${userIdToRemove}`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        }
    })
    return data
}