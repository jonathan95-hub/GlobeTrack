
import { apiFetch } from "../apiFetch/apiFetch"; // i
export const getTopUser = async () =>{
   
    const data = await apiFetch("http://localhost:3000/user/morefollowers",{
        method: 'GET',
        headers:{
            "Content-Type": "application/json",
           
        }
    })
      
    return data
}