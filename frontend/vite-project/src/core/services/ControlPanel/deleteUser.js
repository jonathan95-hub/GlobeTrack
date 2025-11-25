import { apiFetch } from "../apiFetch/apiFetch"

export const deleteUser = async (userId) => {
    const data = apiFetch(`http://localhost:3000/user/delete/${userId}`,{
        method: 'DELETE',
        headers:{
            "Content-Type": "application/json"
        }
    })
    return data
}