import { apiFetch } from "../apiFetch/apiFetch";


export const getPhotos = async() => {

    const data = await apiFetch("http://localhost:3000/ranking/allphotos",{
        method: 'GET',
        headers:{
            "Content-Type": "application/json"
        }
    })
   
    return data
}