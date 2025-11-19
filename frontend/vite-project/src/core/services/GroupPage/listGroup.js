import { apiFetch } from "../apiFetch/apiFetch";


export const  listGroup = async () => {

    const data = await apiFetch("http://localhost:3000/group/listgroup",{
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    
    return data
}

export const listGroupIncludesUser = async() => {

    const data = await apiFetch("http://localhost:3000/group/usergroup",{
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
   
    return data
}

