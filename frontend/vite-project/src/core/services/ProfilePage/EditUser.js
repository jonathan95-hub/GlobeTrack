import { apiFetch } from "../apiFetch/apiFetch";

export const editUser = async (userId, data) => {
  
    const dataRes= await apiFetch(`http://localhost:3000/user/edit/${userId}`,{
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)

    })

   
    return dataRes
}