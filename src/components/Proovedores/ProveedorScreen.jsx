import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa'; // Importar iconos de react-icons
import '../Producto/ProductoScreen.css'; // Asegúrate de importar tu archivo CSS

const ProveedorScreen = () => {
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false); // Agregado para el modal de detalles
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedores = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor/paginacion?page=${currentPage}&size=50`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los proveedores');
        }
        const data = await response.json();
        setProveedores(data.content);
        setFilteredProveedores(data.content); // Set initial filtered list
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching proveedores:', error);
      }
    };

    fetchProveedores();
  }, [token, currentPage]);

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
      const updatedProveedores = proveedores.filter(proveedor => proveedor.id !== selectedProveedor.id);
      setProveedores(updatedProveedores);
      setFilteredProveedores(updatedProveedores); // Update filtered list
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

  const openDetailModal = (proveedor) => {
    setSelectedProveedor(proveedor);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedProveedor(null);
    setShowDetailModal(false);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = () => {
    const searchResult = proveedores.filter(proveedor =>
      proveedor.razonSocial.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProveedores(searchResult);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">Proveedores</h1>
        <button className="button" onClick={handleCreateProveedor}>Crear Proveedor</button>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por Razón Social"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-client"
          />
          <button onClick={handleSearch} className="search-button">
            Buscar
          </button>
        </div>
      </div>
      {/* <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por Razón Social"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="button" onClick={handleSearch}>Buscar</button>
      </div> */}

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
            {filteredProveedores.map((proveedor) => (
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
                  <FaEye 
                    className="icon view-icon" 
                    onClick={() => openDetailModal(proveedor)} 
                  />
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

      <div className="pagination-info">
        <span className='numpag'>Página {currentPage + 1} de {totalPages}</span>
      </div>
      
      <div className="pagination">
        <div className="pagination-buttons">
          <button className="button" id="bt" onClick={handlePreviousPage} disabled={currentPage === 0}>
            Página Anterior
          </button>
          <button className="button" id="bt" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
            Página Siguiente
          </button>
        </div>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {showConfirmModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Eliminación</h5>
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

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Proveedor Eliminado</h5>
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

      {/* Modal de Detalles del Proveedor */}
      {showDetailModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Proveedor</h5>
              </div>
              <div className="modal-body">
                <p><strong>ID:</strong> {selectedProveedor.id}</p>
                <p><strong>Razón Social:</strong> {selectedProveedor.razonSocial}</p>
                <p><strong>CUIT:</strong> {selectedProveedor.cuit}</p>
                <p><strong>Domicilio:</strong> {selectedProveedor.domicilio}</p>
                <p><strong>Teléfono:</strong> {selectedProveedor.telefono}</p>
                <p><strong>Email:</strong> {selectedProveedor.email}</p>
                <p><strong>Provincia:</strong> {selectedProveedor.provincia}</p>
                <p><strong>Localidad:</strong> {selectedProveedor.localidad}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeDetailModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProveedorScreen;
