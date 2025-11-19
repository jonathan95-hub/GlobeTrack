import { apiFetch } from "../apiFetch/apiFetch";


export const getAllCountries = async () => {

    const data = await apiFetch("http://localhost:3000/country/allcountries",{
        method: 'GET',
        headers:{
            "Content-Type": "application/json"
        }
    })
     
    return data
}