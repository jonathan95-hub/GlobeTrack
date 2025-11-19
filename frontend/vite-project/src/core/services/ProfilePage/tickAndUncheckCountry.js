import { apiFetch } from "../apiFetch/apiFetch";


export const  tickUncheckCountryVisited = async (countryId) => {
   
    const data = await apiFetch(`http://localhost:3000/country/visited/${countryId}`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        }
    })
    
    return data
}

export const  tickUncheckCountryDesired = async (countryId) => {
   
    const data = await apiFetch(`http://localhost:3000/country/desired/${countryId}`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        }
    })
     
    return data
}