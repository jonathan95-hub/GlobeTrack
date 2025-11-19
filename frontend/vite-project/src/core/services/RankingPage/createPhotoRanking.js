import { apiFetch } from "../apiFetch/apiFetch";


export const createPhoto = async( image, country) => {

    const data = await apiFetch("http://localhost:3000/ranking/create",{
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ image, country})
    })
    
    return data
}