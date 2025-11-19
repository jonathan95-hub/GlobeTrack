import { apiFetch } from "../apiFetch/apiFetch"


export const countryVisitedTopVisited = async () => {
 
    const data= await apiFetch("http://localhost:3000/country/topvisited",{
        method: 'GET',
        headers:{
            "Content-Type": "application/json",
         
        }
    })
    
    return data
}