export const enterGroupAndExitGroup = async (groupId) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:3000/group/addandexit/${groupId}`,{
        method: 'POST',
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
