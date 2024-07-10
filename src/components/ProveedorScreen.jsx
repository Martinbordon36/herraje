import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar iconos de react-icons
import './ProductoScreen.css'; // Asegúrate de importar tu archivo CSS
import Footer from './Footer';

const ProveedorScreen = () => {
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor/${selectedProveedor.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el proveedor');
      }
      setProveedores(proveedores.filter(proveedor => proveedor.id !== selectedProveedor.id));
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting proveedor:', error);
    }
  };

  const openConfirmModal = (proveedor) => {
    setSelectedProveedor(proveedor);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setSelectedProveedor(null);
    setShowConfirmModal(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
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
                    onClick={() => openConfirmModal(proveedor)} 
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
                <p>¿Estás seguro de que deseas eliminar el proveedor {selectedProveedor.razonSocial}?</p>
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
                <h5 className="modal-title">Proveedor Eliminado</h5>
                <button type="button" className="close" onClick={closeSuccessModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Proveedor eliminado con éxito.</p>
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

export default ProveedorScreen;
