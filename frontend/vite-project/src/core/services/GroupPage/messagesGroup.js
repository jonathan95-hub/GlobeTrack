export const getMessageGroup = async(groupId) => {
    const token  = localStorage.getItem("token")
    const res = await fetch (`http://localhost:3000/groupmessage/getmessage/${groupId}`,{
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


export const sendMessageGroup = async(groupId, content) => {
    const token  = localStorage.getItem("token")
    const res = await fetch (`http://localhost:3000/groupmessage/send/${groupId}`,{
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "token": token
        },
        body: JSON.stringify(content)
    })
    if(!res.ok){
        const text = await res.text()
        throw new Error(text)
    }

    const result = await res.json()
    return result
}