import { apiFetch } from "../apiFetch/apiFetch";


export const topFiveGroup = async () => {
   
    const data = await apiFetch("http://localhost:3000/group/topgroup",{
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            
        }
    })
     
    
    return data
}