import { apiFetch } from "../apiFetch/apiFetch";


export const  countryDesiredTopDesired = async () => {
  
    const data = await apiFetch("http://localhost:3000/country/topdesired",{
        method: 'GET',
        headers:{
            "Content-Type": "application/json",
        }
    })
     
    return data
}