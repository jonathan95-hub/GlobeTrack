export const LOGIN = "LOGIN"
export const LOG_OUT = "LOG_OUT"

export const doLoginAction = (payload) => {
     localStorage.setItem('token', payload.token);
  localStorage.setItem('token_refresh', payload.token_refresh);
  localStorage.setItem('user', JSON.stringify(payload.user)); 
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