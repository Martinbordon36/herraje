import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import './CoeficienteScreen.css'; // Asegúrate de importar tu archivo CSS
import search from '../../assets/lupa.png';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa'; // Importar iconos de react-icons

const CoeficienteScreen = () => {
  const [coeficientes, setCoeficientes] = useState([]);
  const [filteredCoeficientes, setFilteredCoeficientes] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [coeficienteIdAEliminar, setCoeficienteIdAEliminar] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCoeficiente, setSelectedCoeficiente] = useState(null);
  const [editingCoeficiente, setEditingCoeficiente] = useState(null); // Estado para manejar la edición
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoeficientes = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/coeficiente`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los coeficientes');
        }
        const data = await response.json();
        setCoeficientes(data);
        setFilteredCoeficientes(data); // Inicializar coeficientes filtrados
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching coeficientes:', error);
      }
    };

    fetchCoeficientes();
  }, [token, currentPage]);

  const handleCreateCoeficiente = () => {
    navigate('/nuevocoeficiente');
  };

  const handleEdit = (coeficiente) => {
    setEditingCoeficiente({ ...coeficiente }); // Clona el coeficiente que se va a editar
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingCoeficiente((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/coeficiente/${editingCoeficiente.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingCoeficiente),
      });
      if (!response.ok) {
        throw new Error('Error al guardar el coeficiente');
      }

      // Actualiza el estado con el coeficiente editado
      setCoeficientes((prevCoeficientes) =>
        prevCoeficientes.map((coef) =>
          coef.id === editingCoeficiente.id ? editingCoeficiente : coef
        )
      );
      setFilteredCoeficientes((prevCoeficientes) =>
        prevCoeficientes.map((coef) =>
          coef.id === editingCoeficiente.id ? editingCoeficiente : coef
        )
      );
      setEditingCoeficiente(null); // Salir del modo edición
    } catch (error) {
      console.error('Error saving coeficiente:', error);
    }
  };

  const handleDelete = (id) => {
    setCoeficienteIdAEliminar(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/coeficiente/${coeficienteIdAEliminar}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el coeficiente');
      }
      setCoeficientes(coeficientes.filter(coef => coef.id !== coeficienteIdAEliminar));
      setFilteredCoeficientes(filteredCoeficientes.filter(coef => coef.id !== coeficienteIdAEliminar));
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting coeficiente:', error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const openDetailModal = (coeficiente) => {
    setSelectedCoeficiente(coeficiente);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedCoeficiente(null);
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
    setFilteredCoeficientes(
      coeficientes.filter((coef) =>
        coef.proveedor.razonSocial.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleFirstPage = () => {
    setCurrentPage(0);
  };
  
  const handleLastPage = () => {
    setCurrentPage(totalPages - 1);
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h1 className="title">Coeficientes</h1>
        
        <button className="button" onClick={handleCreateCoeficiente}>Crear Coeficiente</button>
      </div>

      <div className="container-search">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por proveedor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-client"
          />
          <a onClick={handleSearch}>
            <img src={search} className='search-button'/>
          </a>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="th">Proveedor</th>
              <th className="th">Zona</th>
              <th className="th">Coeficiente</th>
              <th className="th">Descripción Coeficiente</th>
              <th className="th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoeficientes && filteredCoeficientes.map((coeficiente) => (
              <tr key={coeficiente.id}>
                <td className="td">{coeficiente.proveedor.razonSocial}</td>
                <td className="td">{coeficiente.zona.nombre}</td>
                <td className="td">{coeficiente.coeficienteTotal}</td>
                <td className="td">
                  {editingCoeficiente && editingCoeficiente.id === coeficiente.id ? (
                    <input
                      type="text"
                      name="detalleCoeficientes"
                      value={editingCoeficiente.detalleCoeficientes}
                      onChange={handleInputChange}
                    />
                  ) : (
                    coeficiente.detalleCoeficientes
                  )}
                </td>
                <td className="td">
                  {editingCoeficiente && editingCoeficiente.id === coeficiente.id ? (
                    <button onClick={handleSave}>Guardar</button>
                  ) : (
                    <>
                      <FaEye
                        className="icon view-icon"
                        onClick={() => openDetailModal(coeficiente)}
                      />
                      <FaEdit
                        className="icon edit-icon"
                        onClick={() => handleEdit(coeficiente)}
                      />
                      <FaTrash
                        className="icon delete-icon"
                        onClick={() => handleDelete(coeficiente.id)}
                      />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="pagination">
        <div className="pagination-buttons">
          <button className="button" id="bt" onClick={handleFirstPage} disabled={currentPage === 0}>
            Primera Página
          </button>
          <button className="button" id="bt" onClick={handlePreviousPage} disabled={currentPage === 0}>
            Página Anterior
          </button>
          <button className="button" id="bt" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
            Página Siguiente
          </button>
          <button className="button" id="bt" onClick={handleLastPage} disabled={currentPage === totalPages - 1}>
            Última Página
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
                <p>¿Estás seguro de que quieres eliminar este coeficiente?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>Eliminar</button>
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
                <h5 className="modal-title">Coeficiente Eliminado</h5>
              </div>
              <div className="modal-body">
                <p>El coeficiente ha sido eliminado con éxito.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeSuccessModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles del Coeficiente */}
      {showDetailModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Coeficiente</h5>
              </div>
              <div className="modal-body">
                {selectedCoeficiente && (
                  <div>
                    <p><strong>ID:</strong> {selectedCoeficiente.id}</p>
                    <p><strong>Proveedor:</strong> {selectedCoeficiente.proveedor.razonSocial}</p>
                    <p><strong>Zona:</strong> {selectedCoeficiente.zona.nombre}</p>
                    <p><strong>Coeficiente:</strong> {selectedCoeficiente.coeficienteTotal}</p>
                    <p><strong>Descripción Coeficiente:</strong> {selectedCoeficiente.detalleCoeficientes}</p>
                  </div>
                )}
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

export default CoeficienteScreen;
