import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loginFetch } from '../../../core/services/landinPage/loginFecth';
import { doLoginAction } from './loginAction';
import { useNavigate } from 'react-router-dom';
import { changeMenuOption } from '../../MainLayaout/Header/headerAction';

const LoginComponent = ({ setMenuOptionsInit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { menuOptionsHeader } = useSelector((state) => state.menuReducerHeader);

  const login = async () => {
    try {
      const user = await loginFetch(email, password);
      if (user.token) {
        localStorage.setItem('token', user.token);
        localStorage.setItem('token_refresh', user.token_refresh);
      }
      dispatch(doLoginAction(user));
      navigate('/home');
      dispatch(changeMenuOption(0));
      localStorage.setItem('menuOption', 0);
      console.log('Login exitoso:', user);
    } catch (error) {
      console.error('Error de login:', error.message);
      alert(error.message);
    }
  };

  const backToLanding = () => {
    setMenuOptionsInit('INIT');
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 px-3">
      <div
        className="card shadow-lg border-0 rounded-4 p-4 p-md-5"
        style={{ maxWidth: '420px', width: '100%', }}
      >
        <h3 className="text-center mb-4 fw-bold text-primary">Iniciar sesión</h3>

        <div className="form-group mb-3">
          <label className="fw-semibold text-secondary">Correo electrónico</label>
          <input
            type="email"
            className="form-control rounded-3"
            placeholder="Introduce tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group mb-4">
          <label className="fw-semibold text-secondary">Contraseña</label>
          <input
            type="password"
            className="form-control rounded-3"
            placeholder="Introduce tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="d-flex flex-column gap-3">
          <button
            className="btn btn-primary w-100 rounded-3 fw-semibold shadow-sm"
            onClick={login}
          >
            Acceder
          </button>
          <button
            className="btn btn-outline-primary w-100 rounded-3 fw-semibold"
            onClick={backToLanding}
          >
            Cancelar
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-muted small mb-0">
            ¿Olvidaste tu contraseña? <a href="#" className="text-primary text-decoration-none">Recupérala aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
