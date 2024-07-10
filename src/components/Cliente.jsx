import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Navbar from './Navbar';
import './ProductoScreen.css'; // Asegúrate de importar tu archivo CSS
import Footer from './Footer';

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/${selectedCliente.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el cliente');
      }
      setClientes(clientes.filter(cliente => cliente.id !== selectedCliente.id));
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting cliente:', error);
    }
  };

  const openConfirmModal = (cliente) => {
    setSelectedCliente(cliente);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setSelectedCliente(null);
    setShowConfirmModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
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
                    onClick={() => openConfirmModal(cliente)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showConfirmModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Eliminación</h5>
                <button type="button" className="close" onClick={closeConfirmModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar el cliente {selectedCliente.razonSocial}?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeConfirmModal}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cliente Eliminado</h5>
                <button type="button" className="close" onClick={closeSuccessModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Cliente eliminado con éxito.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeSuccessModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <Footer/> */}
    </>
  );
};

export default Cliente;
