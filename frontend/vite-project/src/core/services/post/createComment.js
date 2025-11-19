import { apiFetch } from "../apiFetch/apiFetch";


export const createComment = async (postId, text, userId) => {
    const data = await apiFetch(`http://localhost:3000/comment/createcomment/${postId}`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({userId, text})
    })
    
    return data
}