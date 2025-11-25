import { apiFetch } from "../apiFetch/apiFetch"

export const deleteAllLog = async() => {
    const data = apiFetch("http://localhost:3000/audit/delete/allLog",{
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })
    return data
}


export const deletedWarning = async() => {
    const data = apiFetch("http://localhost:3000/audit/delete/logWarn",{
        method: 'DELETE',
        headeres: {
            "Content-Type": "application/json"
        }
    })
    return data
}

export const deletedError = async() => {
     const data = apiFetch("http://localhost:3000/audit/delete/logError",{
        method: 'DELETE',
        headeres: {
            "Content-Type": "application/json"
        }
    })
    return data
}

export const deletedInfo = async() => {
     const data = apiFetch("http://localhost:3000/audit/delete/logInfo",{
        method: 'DELETE',
        headeres: {
            "Content-Type": "application/json"
        }
    })
    return data
}