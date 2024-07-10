import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './Proveedores.css';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from './Footer';

const Proveedores = () => {
  const [proveedor, setProveedor] = useState({
    razonSocial: '',
    cuit: '',
    domicilio: '',
    telefono: '',
    email: '',
    provincia: '',
    localidad: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (id) {
      const fetchProveedor = async () => {
        try {
          const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error('Error al obtener el proveedor');
          }
          const data = await response.json();
          setProveedor(data);
        } catch (error) {
          console.error('Error fetching proveedor:', error);
        }
      };

      fetchProveedor();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProveedor({ ...proveedor, [name]: value });
  };

  const validateForm = () => {
    const requiredFields = ['razonSocial', 'cuit', 'domicilio', 'telefono', 'email', 'provincia', 'localidad'];

    for (let field of requiredFields) {
      if (!proveedor[field]) {
        return `El campo ${field} es obligatorio.`;
      }
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
      ? `http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor/${id}` 
      : 'http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor';
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(proveedor)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(id ? 'Error al editar el proveedor' : 'Error al crear el proveedor');
      }
      return response.json();
    })
    .then(data => {
      console.log(id ? 'Proveedor editado:' : 'Proveedor creado:', data);
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
    navigate('/proveedores');
  };

  const successMessage = id ? 'Proveedor editado con éxito.' : 'Proveedor creado con éxito.';

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">{id ? 'Editar Proveedor' : 'Crear Proveedor'}</h1>
          </div>
          <div className="card-body">
            {validationError && <div className="alert alert-danger">{validationError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="razonSocial" className="form-label"> Razón Social</label>
                  <input
                    type="text"
                    id="razonSocial"
                    name="razonSocial"
                    className="form-control"
                    value={proveedor.razonSocial}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="cuit" className="form-label"> CUIT</label>
                  <input
                    type="text"
                    id="cuit"
                    name="cuit"
                    className="form-control"
                    value={proveedor.cuit}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-12">
                  <label htmlFor="domicilio" className="form-label"> Domicilio</label>
                  <input
                    type="text"
                    id="domicilio"
                    name="domicilio"
                    className="form-control"
                    value={proveedor.domicilio}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="telefono" className="form-label">Teléfono</label>
                  <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    className="form-control"
                    value={proveedor.telefono}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={proveedor.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="provincia" className="form-label">Provincia</label>
                  <input
                    type="text"
                    id="provincia"
                    name="provincia"
                    className="form-control"
                    value={proveedor.provincia}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="localidad" className="form-label">Localidad</label>
                  <input
                    type="text"
                    id="localidad"
                    name="localidad"
                    className="form-control"
                    value={proveedor.localidad}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <button className="btn btn-secondary w-100" type="button" onClick={handleBack}>Volver Atrás</button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-primary w-100" type="submit">{id ? 'Guardar Cambios' : 'Crear Proveedor'}</button>
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
                <h5 className="modal-title">{id ? 'Proveedor Editado' : 'Proveedor Creado'}</h5>
                <button type="button" className="close" onClick={closeModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{successMessage}</p>
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

export default Proveedores;
