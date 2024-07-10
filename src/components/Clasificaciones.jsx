import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './ProductoScreen.css';
import Footer from './Footer';

const Clasificaciones = () => {
  const [categoria, setCategoria] = useState({
    descripcion: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (id) {
      const fetchCategoria = async () => {
        try {
          const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/categoria/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error('Error al obtener la categoría');
          }
          const data = await response.json();
          setCategoria(data);
        } catch (error) {
          console.error('Error fetching categoria:', error);
        }
      };

      fetchCategoria();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoria({ ...categoria, [name]: value });
  };

  const validateForm = () => {
    if (!categoria.descripcion) {
      return 'La descripción es obligatoria.';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError('');

    const url = id 
      ? `http://vps-1915951-x.dattaweb.com:8090/api/v1/categoria/${id}` 
      : 'http://vps-1915951-x.dattaweb.com:8090/api/v1/categoria';
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(categoria)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(id ? 'Error al editar la categoría' : 'Error al crear la categoría');
      }
      return response.json();
    })
    .then(data => {
      console.log(id ? 'Categoría editada:' : 'Categoría creada:', data);
      setShowModal(true);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/categorias');
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">{id ? 'Editar Categoría' : 'Agregar Nueva Categoría'}</h1>
          </div>
          <div className="card-body">
            {validationError && <div className="alert alert-danger">{validationError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-12">
                  <label htmlFor="descripcion" className="form-label">(*) Descripción</label>
                  <input
                    type="text"
                    id="descripcion"
                    name="descripcion"
                    className="form-control"
                    value={categoria.descripcion}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <button className="btn btn-secondary w-100" type="button" onClick={handleBack}>Volver Atrás</button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-primary w-100" type="submit">{id ? 'Guardar Cambios' : 'Crear Categoría'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Categoría Confirmada</h5>
                <button type="button" className="close" onClick={closeModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>La categoría se ha confirmado con éxito.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <Footer/> */}
    </>
  );
};

export default Clasificaciones;
