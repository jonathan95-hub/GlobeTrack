export const LOGIN = "LOGIN"
export const LOG_OUT = "LOG_OUT"

export const doLoginAction = (payload) => {
    return{
        type: LOGIN,
        payload
    }
}

export const doLoginOutAction = (payload) =>{
    return{
        type: LOG_OUT,
        payload
    }
}