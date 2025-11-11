
export const  tickUncheckCountryVisited = async (countryId) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:3000/country/visited/${countryId}`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "token": token
        }
    })
    if(!res.ok){
        const text = await res.text()
        throw new Error(text)
    }
    const result = await res.json()
    return result
}

export const  tickUncheckCountryDesired = async (countryId) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:3000/country/desired/${countryId}`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "token": token
        }
    })
    if(!res.ok){
        const text = await res.text()
        throw new Error(text)
    }
    const result = await res.json()
    return result
}