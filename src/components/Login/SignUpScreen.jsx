import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupScreen.css';
import avatarImage from '../../assets/herraje.jpeg';; // Ajusta la ruta según corresponda

const SignupScreen = () => {
  const [fullName, setFullName] = useState('');
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
      const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al crear usuario');
      }

      const data = await response.json();
      console.log("Registro correcto");
      navigate('/');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="avatar">
          <img src={avatarImage} alt="avatar" className="avatar-image"/>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <i className="fa fa-user icon"></i>
            <input
              type="text"
              placeholder="Nombre"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="input-container">
            <i className="fa fa-envelope icon"></i>
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
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? 'Loading...' : 'Crear Usuario'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default SignupScreen;
