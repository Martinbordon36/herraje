import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Asegúrate de tener react-router-dom instalado
import './LoginScreen.css';
import toolImage from '../assets/herraje.jpeg';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Usuario no encontrado');
      }

      const data = await response.json();
      console.log("INGRESO CORRECTO");
      console.log('Token:', data.token);
      localStorage.setItem('token', data.token);
      navigate('/productos'); // Redirigir al componente Home
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    navigate('/crearusuario'); // Redirigir al componente de registro
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="avatar">
          <img src={toolImage} alt="avatar" className="avatar-image"/>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <i className="fa fa-user icon"></i>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-container">
            <i className="fa fa-lock icon"></i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Loading...' : 'LOGIN'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
        <button onClick={handleSignupRedirect} className="signup-redirect-button">
          Crear usuario
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
