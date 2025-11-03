export const register = async(newUser) => {
    const res = await fetch("http://localhost:3000/auth/signup",{
        method: 'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
    })
    const result = await res.json()
    return result
}

