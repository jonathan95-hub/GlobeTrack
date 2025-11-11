export const getInfoUser = async(userId) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:3000/user/${userId}`,{
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