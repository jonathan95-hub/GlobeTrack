import { apiFetch } from "../apiFetch/apiFetch"

export const obtainedFollowersOtherUser = async(userId) => {
    const data = apiFetch(`http://localhost:3000/user/otheruserfollowers/${userId}`,{
        method: 'GET',
        headers:{
            "Content-Type": "application/json"
        }
    })
    return data
}
export const obtainedFollowingOtherUser = async(userId) => {
    const data = apiFetch(`http://localhost:3000/user/otheruserfollowing/${userId}`,{
        method: 'GET',
        headers:{
            "Content-Type": "application/json"
        }
    })
    return data
}