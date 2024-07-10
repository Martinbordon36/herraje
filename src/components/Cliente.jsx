import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Navbar from './Navbar';
import './ProductoScreen.css'; // Asegúrate de importar tu archivo CSS

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Este es el token " + token);

    const fetchClientes = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los clientes');
        }
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error('Error fetching clientes:', error);
      }
    };

    fetchClientes();
  }, [token]);

  const handleCreateCliente = () => {
    navigate('/nuevoCliente');
  };

  const handleEdit = (id) => {
    navigate(`/editarCliente/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el cliente');
      }
      setClientes(clientes.filter(cliente => cliente.id !== id));
    } catch (error) {
      console.error('Error deleting cliente:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">Clientes</h1>
        <button className="button" onClick={handleCreateCliente}>Crear Cliente</button>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="th">#ID Cliente</th>
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
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td className="td">{cliente.id}</td>
                <td className="td">{cliente.razonSocial}</td>
                <td className="td">{cliente.cuit}</td>
                <td className="td">{cliente.domicilio}</td>
                <td className="td">{cliente.telefono}</td>
                <td className="td">{cliente.email}</td>
                <td className="td">{cliente.provincia}</td>
                <td className="td">{cliente.localidad}</td>
                <td className="td">
                  <FaEdit 
                    className="icon edit-icon" 
                    onClick={() => handleEdit(cliente.id)} 
                  />
                  <FaTrash 
                    className="icon delete-icon" 
                    onClick={() => handleDelete(cliente.id)} 
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

export default Cliente;
