export const createNewPost = async (title,text, imageBase64, location) => {
    try {
        const token = localStorage.getItem("token")
        const body = {
               title,
                text,
                location,
                image: imageBase64
        }
        const res = await fetch("http://localhost:3000/post/create",{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "token": token 
            },
            body: JSON.stringify(body)

        })
        if(!res.ok){
            const text = await res.text()
            throw new Error(text)
        }

        const result = await res.json()
        return result
    } catch (error) {
         console.error("Error creando el post:", error);
    throw error;
    }
}