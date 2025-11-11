export const editUser = async (userId, data) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:3000/user/edit/${userId}`,{
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "token": token
        },
        body: JSON.stringify(data)

    })
    if(!res.ok){
        const text = await res.text()
        throw new Error(text)
    }

    const result = await res.json()
    return result
}