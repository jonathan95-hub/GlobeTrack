import { apiFetch } from "../apiFetch/apiFetch";


export const createNewPost = async (title,text, imageBase64, location) => {
    try {
       
        const body = {
               title,
                text,
                location,
                image: imageBase64
        }
        const data = await apiFetch("http://localhost:3000/post/create",{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)

        })
        
        return data
    } catch (error) {
         console.error("Error creando el post:", error);
    throw error;
    }
}