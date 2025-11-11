export const getMessagePrivate = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:3000/privatemessage/obtainedmessage`,{
        method: 'GET',
        headers:{
            "Content-Type": "application/json",
            "token": token
        },
        
    })
    if(!res.ok){
        const text = await res.text()
        throw new Error(text)
    }
    const result = await res.json()
    return result
}

export const sendMessagesPrivates = async(receptorUserId, content) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:3000/privatemessage/sendprivate/${receptorUserId}`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "token": token
        },
        body: JSON.stringify({content})
    })
    if(!res.ok){
        const text = await res.text()
        throw new Error(text)
    }
    const result = await res.json()
    return result
}