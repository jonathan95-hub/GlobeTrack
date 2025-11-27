import { apiFetch } from "../apiFetch/apiFetch"

export const deletedComment = async(commnetId) => {
    const data = apiFetch(`http://localhost:3000/comment/delete/${commnetId}`,{
        method: 'DELETE',
        headers:{
            "Content-Type": "application/json"
        }
    })
    return data
}