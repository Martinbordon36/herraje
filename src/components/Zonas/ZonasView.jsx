import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import search from '../../assets/lupa.png';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const ZonasView = () => {
  const [zonas, setZonas] = useState([]);
  const [filteredZonas, setFilteredZonas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [zonaIdAEliminar, setZonaIdAEliminar] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedZona, setSelectedZona] = useState(null);
  const [editingZona, setEditingZona] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newZona, setNewZona] = useState({
    nombre: ''
  });

  useEffect(() => {
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
        setFilteredZonas(data);
      } catch (error) {
        console.error('Error fetching zonas:', error);
      }
    };

    fetchZonas();
  }, []);

  const handleCreateZona = () => {
    setShowCreateModal(true);
  };

  const handleSaveNewZona = async () => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/zona`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newZona),
      });
      if (!response.ok) {
        throw new Error('Error al guardar la zona');
      }
      const createdZona = await response.json();
      setZonas([...zonas, createdZona]);
      setFilteredZonas([...filteredZonas, createdZona]);
      setShowCreateModal(false);
      setNewZona({ nombre: '' });
    } catch (error) {
      console.error('Error saving new zona:', error);
    }
  };

  const handleEdit = (zona) => {
    setEditingZona({ ...zona });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingZona((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/zona/${editingZona.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingZona),
      });
      if (!response.ok) {
        throw new Error('Error al guardar la zona');
      }

      setZonas((prevZonas) =>
        prevZonas.map((zona) =>
          zona.id === editingZona.id ? editingZona : zona
        )
      );
      setFilteredZonas((prevZonas) =>
        prevZonas.map((zona) =>
          zona.id === editingZona.id ? editingZona : zona
        )
      );
      setEditingZona(null);
    } catch (error) {
      console.error('Error saving zona:', error);
    }
  };

  const handleDelete = (id) => {
    setZonaIdAEliminar(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/zona/${zonaIdAEliminar}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al eliminar la zona');
      }
      setZonas(zonas.filter(zona => zona.id !== zonaIdAEliminar));
      setFilteredZonas(filteredZonas.filter(zona => zona.id !== zonaIdAEliminar));
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting zona:', error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const openDetailModal = (zona) => {
    setSelectedZona(zona);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedZona(null);
    setShowDetailModal(false);
  };

  const handleSearch = () => {
    setFilteredZonas(
      zonas.filter((zona) =>
        zona.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h1 className="title">Listado de Zonas</h1>
        <button className="button" onClick={handleCreateZona}>Crear Zona</button>
        </div>


      <div className="container-search">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nombre de zona"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
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
              <th className="th">ID</th>
              <th className="th">Nombre</th>
              <th className="th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredZonas && filteredZonas.map((zona) => (
              <tr key={zona.id}>
                <td className="td">{zona.id}</td>
                <td className="td">
                  {editingZona && editingZona.id === zona.id ? (
                    <input
                      type="text"
                      name="nombre"
                      value={editingZona.nombre}
                      onChange={handleInputChange}
                    />
                  ) : (
                    zona.nombre
                  )}
                </td>
                <td className="td">
                  {editingZona && editingZona.id === zona.id ? (
                    <button onClick={handleSave}>Guardar</button>
                  ) : (
                    <>
                      <FaEye
                        className="icon view-icon"
                        onClick={() => openDetailModal(zona)}
                      />
                      {/* <FaEdit
                        className="icon edit-icon"
                        onClick={() => handleEdit(zona)}
                      />
                      <FaTrash
                        className="icon delete-icon"
                        onClick={() => handleDelete(zona.id)}
                      /> */}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Creación */}
      {showCreateModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Zona</h5>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nombre de Zona</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newZona.nombre}
                    onChange={(e) => setNewZona({ ...newZona, nombre: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveNewZona}>Guardar</button>
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
                <p>¿Estás seguro de que quieres eliminar esta zona?</p>
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
                <h5 className="modal-title">Zona Eliminada</h5>
              </div>
              <div className="modal-body">
                <p>La zona ha sido eliminada con éxito.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeSuccessModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles de la Zona */}
      {showDetailModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles de la Zona</h5>
              </div>
              <div className="modal-body">
                {selectedZona && (
                  <div>
                    <p><strong>ID:</strong> {selectedZona.id}</p>
                    <p><strong>Nombre:</strong> {selectedZona.nombre}</p>
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

export default ZonasView;
