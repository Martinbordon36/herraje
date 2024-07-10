import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar iconos de react-icons
import './ProductoScreen.css'; // Asegúrate de importar tu archivo CSS

const ProveedorScreen = () => {
  const [proveedores, setProveedores] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Este es el token " + token);

    const fetchProveedores = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los proveedores');
        }
        const data = await response.json();
        setProveedores(data);
      } catch (error) {
        console.error('Error fetching proveedores:', error);
      }
    };

    fetchProveedores();
  }, [token]);

  const handleCreateProveedor = () => {
    navigate('/nuevoproveedor');
  };

  const handleEdit = (id) => {
    navigate(`/editarproveedor/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el proveedor');
      }
      setProveedores(proveedores.filter(proveedor => proveedor.id !== id));
    } catch (error) {
      console.error('Error deleting proveedor:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">Proveedores</h1>
        <button className="button" onClick={handleCreateProveedor}>Crear Proveedor</button>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="th">#ID de proveedor</th>
              <th className="th">Razón Social</th>
              <th className="th">CUIT</th>
              <th className="th">Domicilio</th>
              <th className="th">Teléfono</th>
              <th className="th">Email</th>
              <th className="th">Provincia</th>
              <th className="th">Localidad</th>
              <th className="th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((proveedor) => (
              <tr key={proveedor.id}>
                <td className="td">{proveedor.id}</td>
                <td className="td">{proveedor.razonSocial}</td>
                <td className="td">{proveedor.cuit}</td>
                <td className="td">{proveedor.domicilio}</td>
                <td className="td">{proveedor.telefono}</td>
                <td className="td">{proveedor.email}</td>
                <td className="td">{proveedor.provincia}</td>
                <td className="td">{proveedor.localidad}</td>
                <td className="td">
                  <FaEdit 
                    className="icon edit-icon" 
                    onClick={() => handleEdit(proveedor.id)} 
                  />
                  <FaTrash 
                    className="icon delete-icon" 
                    onClick={() => handleDelete(proveedor.id)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProveedorScreen;
