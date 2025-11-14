export const likeAndUnlikePost = async (postId) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:3000/post/like/${postId}`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "token": token
        }
    })
    if(!res.ok){
        const text = await res.text()
        throw new Error(text)
    }
     const result = await res.json()
     return result
}