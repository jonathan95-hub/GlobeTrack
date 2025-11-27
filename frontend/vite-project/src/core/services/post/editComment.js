import { apiFetch } from "../apiFetch/apiFetch"

export const editComment = async(commentId, text) => {
    const data = apiFetch(`http://localhost:3000/comment/edit/${commentId}`,{
        method: 'PATCH',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({text})
    })
    return data
}