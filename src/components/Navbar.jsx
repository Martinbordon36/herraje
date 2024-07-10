import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Elimina el token del localStorage o realiza cualquier otra acción necesaria para cerrar sesión
    localStorage.removeItem('token');
    // Redirige al usuario a la página de inicio de sesión
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Herrajes Almada</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/proveedores">Proveedores</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clientes">Clientes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pedidos">Pedidos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categorias">Categorias</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productos">Productos</Link>
            </li>
          </ul>
          <button className="btn btn-outline-light" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
