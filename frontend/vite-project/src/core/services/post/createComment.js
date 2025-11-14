export const createComment = async (postId, text, userId) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:3000/comment/createcomment/${postId}`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "token": token
        },
        body: JSON.stringify({userId, text})
    })
    if(!res.ok){
        const text = await res.text()
        throw new Error(text)
    }

    const result = await res.json()
    return result
}