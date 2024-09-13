import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid container-centered">
        <Link className="navbar-brand btn-logo" to="/productos">Herraje Almada</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="#" id="productosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Proveedores
              </Link>
              <ul className="dropdown-menu" aria-labelledby="productosDropdown">
                <li><Link className="dropdown-item" to="/proveedores">Ver Proveedores</Link></li>
                <li><Link className="dropdown-item" to="/nuevoProveedor">Crear Proveedor</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="#" id="clientesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Clientes
              </Link>
              <ul className="dropdown-menu" aria-labelledby="clientesDropdown">
                <li><Link className="dropdown-item" to="/clientes">Ver Clientes</Link></li>
                <li><Link className="dropdown-item" to="/nuevoCliente">Crear Cliente</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="#" id="pedidosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Reportes
              </Link>
              <ul className="dropdown-menu" aria-labelledby="pedidosDropdown">
                <li><Link className="dropdown-item" to="/pedidos">Ver Pedidos</Link></li>
                <li><Link className="dropdown-item" to="/facturas">Ver Facturas</Link></li>
                <li><Link className="dropdown-item" to="/facturas">Ver Presupuestos</Link></li>
                <li><Link className="dropdown-item" to="/nuevoPedido">Crear Pedidos</Link></li>
                <li><Link className="dropdown-item" to="/nuevoPresupuesto">Crear Presupuesto</Link></li>
                <li><Link className="dropdown-item" to="/crearFactura">Crear Factura</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="#" id="categoriasDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Categorías
              </Link>
              <ul className="dropdown-menu" aria-labelledby="categoriasDropdown">
                <li><Link className="dropdown-item" to="/categorias">Listado de Categorias</Link></li>
                <li><Link className="dropdown-item" to="/nuevacategoria">Crear Categoria</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="#" id="productosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Productos
              </Link>
              <ul className="dropdown-menu" aria-labelledby="productosDropdown">
                <li><Link className="dropdown-item" to="/productos">Listado de Productos</Link></li>
                <li><Link className="dropdown-item" to="/actualizarPrecios">Actualizar Precios Productos</Link></li>
                <li><Link className="dropdown-item" to="/generarExcel">Generar lista de precios</Link></li>

              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="#" id="productosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Zonas
              </Link>
              <ul className="dropdown-menu" aria-labelledby="productosDropdown">
                <li><Link className="dropdown-item" to="/zonas">Listado de Zonas</Link></li>
                <li><Link className="dropdown-item" to="/actualizarPrecios">Crear Zonas</Link></li>
                <li><Link className="dropdown-item" to="/modificarCoeficientes">Modificar Coeficientes</Link></li>

              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="#" id="productosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                FacturaCompras
              </Link>
              <ul className="dropdown-menu" aria-labelledby="productosDropdown">
                <li><Link className="dropdown-item" to="/crearFacturaCompra">Crear FacturaCompras</Link></li>
                <li><Link className="dropdown-item" to="/FacturaSCompra">Ver Todas</Link></li>
              </ul>
            </li>
          </ul>
          <button className="btn btn-outline-light btn-cerrar" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
