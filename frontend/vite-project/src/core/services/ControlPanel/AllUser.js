import { apiFetch } from "../apiFetch/apiFetch";

export const allUser = async () => {
     const data = await apiFetch("http://localhost:3000/user/all",{
        method: 'GET',
        headers:{
            "Content-Type": "application/json"
        }
     })
     return data
}