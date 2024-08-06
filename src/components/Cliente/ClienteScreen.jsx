import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import './ClienteScreen.css';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../Others/Footer';

const ClienteScreen = () => {
  const [cliente, setCliente] = useState({
    razonSocial: '',
    cuit: '',
    domicilio: '',
    telefono: '',
    email: '',
    provincia: '',
    localidad: ''
  });
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Obtener todos los clientes
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
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

    if (id) {
      const fetchCliente = async () => {
        try {
          const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error('Error al obtener el cliente');
          }
          const data = await response.json();
          setCliente(data);
        } catch (error) {
          console.error('Error fetching cliente:', error);
        }
      };

      fetchCliente();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const validateForm = () => {
    for (let key in cliente) {
      if (!cliente[key]) {
        return `El campo ${key} es obligatorio.`;
      }
    }

    // Validar si el CUIT ya existe
    if (!id && clientes.some(c => c.cuit === cliente.cuit)) {
      return 'El CUIT ya está registrado.';
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
      ? `http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/${id}` 
      : 'http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente';
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cliente)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(id ? 'Error al editar el cliente' : 'Error al crear el cliente');
      }
      return response.json();
    })
    .then(data => {
      console.log(id ? 'Cliente editado:' : 'Cliente creado:', data);
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
    navigate('/clientes');
  };

  const modalTitle = id ? 'Cliente Editado' : 'Cliente Creado';
  const modalMessage = id ? 'Cliente editado con éxito.' : 'Cliente creado con éxito.';

  return (
    <>
      <Navbar />
      <br/>
      <br/>
      <br/>

      <div className="container mt-4">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">{id ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}</h1>
          </div>
          <div className="card-body">
            {validationError && <div className="alert alert-danger">{validationError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="razonSocial" className="form-label">Razón Social</label>
                  <input
                    type="text"
                    id="razonSocial"
                    name="razonSocial"
                    className="form-control"
                    value={cliente.razonSocial}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="cuit" className="form-label">CUIT</label>
                  <input
                    type="text"
                    id="cuit"
                    name="cuit"
                    className="form-control"
                    value={cliente.cuit}
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
                    value={cliente.domicilio}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="telefono" className="form-label"> Teléfono</label>
                  <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    className="form-control"
                    value={cliente.telefono}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label"> Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={cliente.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="provincia" className="form-label"> Provincia</label>
                  <input
                    type="text"
                    id="provincia"
                    name="provincia"
                    className="form-control"
                    value={cliente.provincia}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="localidad" className="form-label"> Localidad</label>
                  <input
                    type="text"
                    id="localidad"
                    name="localidad"
                    className="form-control"
                    value={cliente.localidad}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <button className="btn btn-secondary w-100" type="button" onClick={handleBack}>Volver Atrás</button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-primary w-100" type="submit">{id ? 'Guardar Cambios' : 'Guardar Cliente'}</button>
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
                <h5 className="modal-title">{modalTitle}</h5>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClienteScreen;
