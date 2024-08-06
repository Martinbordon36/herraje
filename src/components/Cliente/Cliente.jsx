import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Navbar from '../Others/Navbar';
import '../Producto/ProductoScreen.css';
import Footer from '../Others/Footer';

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]); // Estado para clientes filtrados
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch(
          `http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/paginacion?page=${currentPage}&size=5`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error('Error al obtener los clientes');
        }
        const data = await response.json();
        setClientes(data.content);
        setFilteredClientes(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching clientes:', error);
      }
    };

    fetchClientes();
  }, [token, currentPage]);

  const handleCreateCliente = () => {
    navigate('/nuevoCliente');
  };

  const handleEdit = (id) => {
    navigate(`/editarCliente/${id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/${selectedCliente.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Error al eliminar el cliente');
      }
      setClientes(clientes.filter((cliente) => cliente.id !== selectedCliente.id));
      setFilteredClientes(filteredClientes.filter((cliente) => cliente.id !== selectedCliente.id));
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

  const openDetailModal = (cliente) => {
    setSelectedCliente(cliente);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedCliente(null);
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
    if (searchTerm === '') {
      setFilteredClientes(clientes);
    } else {
      setFilteredClientes(
        clientes.filter((cliente) =>
          cliente.razonSocial.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">Clientes</h1>
        <button className="button" onClick={handleCreateCliente}>
          Crear Cliente
        </button>
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
            {filteredClientes.map((cliente) => (
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
                  <FaEye
                    className="icon view-icon"
                    onClick={() => openDetailModal(cliente)}
                  />
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
      <div className="pagination-info">
        <span className="numpag">
          Página {currentPage + 1} de {totalPages}
        </span>
      </div>

      <div className="pagination">
        <div className="pagination-buttons">
          <button
            className="button"
            id="bt"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            Página Anterior
          </button>
          <button
            className="button"
            id="bt"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
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
                <p>
                  ¿Estás seguro de que deseas eliminar el cliente{' '}
                  {selectedCliente.razonSocial}?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeConfirmModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Eliminar
                </button>
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
                <h5 className="modal-title">Cliente Eliminado</h5>
              </div>
              <div className="modal-body">
                <p>Cliente eliminado con éxito.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={closeSuccessModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles del Cliente */}
      {showDetailModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Cliente</h5>
              </div>
              <div className="modal-body">
                <p>ID Cliente: {selectedCliente.id}</p>
                <p>Razón Social: {selectedCliente.razonSocial}</p>
                <p>CUIT: {selectedCliente.cuit}</p>
                <p>Domicilio: {selectedCliente.domicilio}</p>
                <p>Teléfono: {selectedCliente.telefono}</p>
                <p>Email: {selectedCliente.email}</p>
                <p>Provincia: {selectedCliente.provincia}</p>
                <p>Localidad: {selectedCliente.localidad}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeDetailModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Cliente;
