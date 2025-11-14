export const createNewGroup = async (name, photoGroup, description) => {
     const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:3000/group/newgroup",{
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "token": token
        },
        body: JSON.stringify({name, photoGroup, description})
    })
    if(!res.ok){
        const text = await res.text()
        throw new Error(text)
    }
    const result = await res.json()
    return result
}