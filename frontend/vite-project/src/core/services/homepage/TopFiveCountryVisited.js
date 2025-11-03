export const countryVisitedTopVisited = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:3000/country/topvisited",{
        method: 'GET',
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