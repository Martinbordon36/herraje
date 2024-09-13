import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import './CoeficienteScreen.css';
import search from '../../assets/lupa.png';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const CoeficienteScreen = () => {
  const [coeficientes, setCoeficientes] = useState([]);
  const [filteredCoeficientes, setFilteredCoeficientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [coeficienteIdAEliminar, setCoeficienteIdAEliminar] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCoeficiente, setSelectedCoeficiente] = useState(null);
  const [editingCoeficiente, setEditingCoeficiente] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false); // Estado para mostrar/ocultar modal de creación
  const [newCoeficiente, setNewCoeficiente] = useState({
    idCoeficiente: '',  // Agregado para reflejar el id del coeficiente
    idProveedor: '',
    idZona: '',
    coeficienteTotal: '',
    descripcionCoeficiente: ''
  });
  const [proveedores, setProveedores] = useState([]);
  const [zonas, setZonas] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoeficientes = async () => {
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
        setFilteredCoeficientes(data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching coeficientes:', error);
      }
    };

    const fetchProveedores = async () => {
      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await response.json();
        setProveedores(data);
      } catch (error) {
        console.error('Error fetching proveedores:', error);
      }
    };

    const fetchZonas = async () => {
      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/zona`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await response.json();
        setZonas(data);
      } catch (error) {
        console.error('Error fetching zonas:', error);
      }
    };

    fetchCoeficientes();
    fetchProveedores();
    fetchZonas();
  }, [token, currentPage]);

  const handleCreateCoeficiente = () => {
    setShowCreateModal(true); // Mostrar modal de creación
  };

  const handleSaveNewCoeficiente = async () => {
    // Formatear el JSON correctamente
    const coeficienteData = {
      idCoeficiente: parseInt(newCoeficiente.idCoeficiente),
      idProveedor: parseInt(newCoeficiente.idProveedor),
      idZona: parseInt(newCoeficiente.idZona),
      coeficienteTotal: parseFloat(newCoeficiente.coeficienteTotal),
      descripcionCoeficiente: newCoeficiente.descripcionCoeficiente
    };

    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/coeficiente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(coeficienteData),
      });
      if (!response.ok) {
        throw new Error('Error al guardar el coeficiente');
      }
      const createdCoeficiente = await response.json();
      setCoeficientes([...coeficientes, createdCoeficiente]);
      setFilteredCoeficientes([...filteredCoeficientes, createdCoeficiente]);
      setShowCreateModal(false); // Ocultar modal después de guardar
      setNewCoeficiente({
        idCoeficiente: '',
        idProveedor: '',
        idZona: '',
        coeficienteTotal: '',
        descripcionCoeficiente: ''
      });
    } catch (error) {
      console.error('Error saving new coeficiente:', error);
    }
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
      if (!editingCoeficiente) {
        throw new Error("No hay ningún coeficiente en edición.");
      }
  
      // Validar que el coeficiente en edición tiene un ID válido
      if (!editingCoeficiente.id) {
        throw new Error("El ID del coeficiente es requerido para la actualización.");
      }
  
      // Crear el arreglo de coeficientes, que contendrá todos los datos actuales pero solo modificará `descripcionCoeficiente`
      const coeficienteData = coeficientes.map((coef) => {
        if (!coef.id) {
          throw new Error(`El coeficiente con idProveedor ${coef.proveedor.razonSocial} no tiene un id válido.`);
        }
  
        // Solo actualiza el coeficiente que se está editando
        if (coef.id === editingCoeficiente.id) {
          return {
            id: editingCoeficiente.id, // Usamos `id` en lugar de `idCoeficiente`
            idProveedor: editingCoeficiente.idProveedor, // Se mantienen los mismos
            idZona: editingCoeficiente.idZona,           // Se mantienen los mismos
            coeficienteTotal: editingCoeficiente.coeficienteTotal, // Se mantienen los mismos
            descripcionCoeficiente: editingCoeficiente.descripcionCoeficiente // Este es el único que se edita
          };
        } else {
          // Los demás coeficientes se mantienen igual
          return coef;
        }
      });
  
      console.log("Datos que se enviarán:", coeficienteData);
  
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/coeficiente`, {
        method: 'PUT', // Usamos PUT para la actualización
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(coeficienteData), // Enviar el arreglo completo de coeficientes
      });
  
      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Error en la API: ${response.status} - ${response.statusText}. Respuesta: ${responseText}`);
      }
  
      const updatedCoeficientes = await response.json();
  
      // Actualizamos el estado con los coeficientes actualizados
      setCoeficientes(updatedCoeficientes); // Asumimos que el backend retorna la lista completa actualizada
      setFilteredCoeficientes(updatedCoeficientes); // Actualizamos también la lista filtrada
      setEditingCoeficiente(null); // Salimos del modo edición
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

      {/* Modal de Creación */}
      {showCreateModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Coeficiente</h5>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>ID Coeficiente</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newCoeficiente.idCoeficiente}
                    onChange={(e) => setNewCoeficiente({ ...newCoeficiente, idCoeficiente: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Proveedor</label>
                  <select
                    className="form-control"
                    value={newCoeficiente.idProveedor}
                    onChange={(e) => setNewCoeficiente({ ...newCoeficiente, idProveedor: e.target.value })}
                  >
                    <option value="">Seleccionar Proveedor</option>
                    {proveedores.map((proveedor) => (
                      <option key={proveedor.id} value={proveedor.id}>{proveedor.razonSocial}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Zona</label>
                  <select
                    className="form-control"
                    value={newCoeficiente.idZona}
                    onChange={(e) => setNewCoeficiente({ ...newCoeficiente, idZona: e.target.value })}
                  >
                    <option value="">Seleccionar Zona</option>
                    {zonas.map((zona) => (
                      <option key={zona.id} value={zona.id}>{zona.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Coeficiente Total</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={newCoeficiente.coeficienteTotal}
                    onChange={(e) => setNewCoeficiente({ ...newCoeficiente, coeficienteTotal: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Descripción Coeficiente</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCoeficiente.descripcionCoeficiente}
                    onChange={(e) => setNewCoeficiente({ ...newCoeficiente, descripcionCoeficiente: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveNewCoeficiente}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

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