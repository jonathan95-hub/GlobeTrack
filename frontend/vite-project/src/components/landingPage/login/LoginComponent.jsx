import React, { useEffect } from 'react';
import { useState } from 'react';
import{useDispatch} from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';
import { loginFetch } from '../../../core/services/loginFecth';
import { doLoginAction } from './loginAction';
import { useNavigate } from 'react-router-dom';



const LoginComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  

  const login = async () => {
  try {
    const user = await loginFetch(email, password);
    if(user.token){
      localStorage.setItem('token', user.token)
      localStorage.setItem('token_refresh', user.token_refresh)
    }
    dispatch(
      doLoginAction(user)
    )
    navigate("/home")
    console.log("Login exitoso:", user);
    // guardar token, redirigir, etc.
  } catch (error) {
    console.error("Error de login:", error.message);
    alert(error.message); 
  }
};


  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="login-container containerLogin">
        <h2 className="login-title">Login</h2>

        <div className="form-group mb-3">
          <label>Email</label>
          <input type="email" className="form-control" placeholder="Introduce tu email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-group mb-4">
          <label>Contraseña</label>
          <input type="password" className="form-control" placeholder="Introduce tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="login-buttons d-flex flex-column gap-3">
          <button className="login-btn" onClick={login}>Acceder</button>
          <button className="login-btn-outline">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
