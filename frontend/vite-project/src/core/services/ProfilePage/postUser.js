export const getPostUserFetch = async(userId) => {
    try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:3000/post/userpost/${userId}`,{
            method: 'GET',
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
    } catch (error) {
         console.error("Error cargando publicaciones del usuario:", error);
         throw error;
    }
}