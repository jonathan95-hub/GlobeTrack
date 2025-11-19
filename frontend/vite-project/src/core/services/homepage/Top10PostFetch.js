import { apiFetch } from "../apiFetch/apiFetch";


export const bestPost = async () => {
  
        const data = await apiFetch("http://localhost:3000/post/top",{
            method: 'GET',
            headers:{
                "Content-Type": "application/json",
             
            }
        }) 
        return data
}