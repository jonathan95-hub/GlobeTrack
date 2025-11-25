import { apiFetch } from "../apiFetch/apiFetch"

export const obtainedFollowers = async(userId) => {
    const data = await apiFetch(`http://localhost:3000/user/followers/${userId}`,{
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    return data
}

export const obtainedFollowing = async(userId) => {
    const data = await apiFetch(`http://localhost:3000/user/following/${userId}`,{
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    return data
}