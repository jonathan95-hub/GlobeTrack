export const loginFetch = async(email, password) => {
    const res = await fetch("http://localhost:3000/auth/login",{
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
        
    });

     if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
    const result = await res.json()
    return result
}