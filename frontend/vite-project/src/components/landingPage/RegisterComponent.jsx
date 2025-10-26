import React, { useState } from 'react'
import { register } from '../../core/services/registerFetch'

const RegisterComponent = (props) => {

  const {
    setMenuOptionsInit
  } = props

  const[registerData, setRegisterData] = useState({
    name: "",
    lastName: "",
    email: "",
    birthDate: "",
    password: "",
    country: "",
    city: "",

  })

  const inputHandler = (nameProps, valueProps) => {
    setRegisterData({
      ...registerData,
      [nameProps]: valueProps
    })
    
  }

  const backToLogin = () => {
    setMenuOptionsInit("INIT")
  }

  const signupUser = async () => {
    try {
      const registerUser = await register(registerData)
      if(registerUser.status === "Failed" || registerUser.status === "Error"){
        alert(registerUser.message)
        console.log("Error en registro", registerUser.message)
        return
      }
      console.log("Registro exitoso", registerUser) 
      alert("Registro exitoso")
      backToLogin()
    } catch (error) {
      console.error("Error de login:", error.message);
    alert(error.message); 
    }
  }
  
  return (
    <div className="register-card"> 
      <h2>Registro</h2>
      <form className="register-form">
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" className="form-control" name='name' value={registerData.name} onChange={(e) => inputHandler(e.target.name, e.target.value)}/>
        </div>
        <div className="form-group">
          <label>Apellidos</label>
          <input type="text" className="form-control" name='lastName' value={registerData.lastName} onChange={(e) => inputHandler(e.target.name, e.target.value)}/>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" name='email' value={registerData.email} onChange={(e) => inputHandler(e.target.name, e.target.value)}/>
        </div>
        <div className="form-group">
          <label>F. nacimiento</label>
          <input type="text" className="form-control" name='birthDate' value={registerData.birthDate} onChange={(e) => inputHandler(e.target.name, e.target.value)}/>
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" className="form-control" name='password' value={registerData.password} onChange={(e) => inputHandler(e.target.name, e.target.value)}/>
        </div>
        <div className="form-group">
          <label>País</label>
          <input type="text" className="form-control" name='country' value={registerData.country} onChange={(e) => inputHandler(e.target.name, e.target.value)}/>
        </div>
        <div className="form-group">
          <label>Ciudad</label>
          <input type="text" className="form-control" name='city' value={registerData.city} onChange={(e) => inputHandler(e.target.name, e.target.value)}/>
        </div>

        <div className="button-container">
          <button type="submit" className="btn btn-custom" onClick={(e) =>{e.preventDefault(); signupUser()}}>Registrar</button>
          <button type="button" className="btn btn-custom-outline">Cancelar</button>
        </div>
      </form>
    </div>
  )
}

export default RegisterComponent;
