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
    localidad: '',
    nroIngresosBrutos: '',
    numeroDocumento:'',
    celular:'',
    idVendedor: '',
    zona: ' ',
    grupo: ' ',
    codPostal : 5300,
    ctaContame: ' ',
    ivtCodigo:1, 
    estado: 'Activo',
    pais: 'Argentina'

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
    console.log("Esto hay en name y value" + name, value)
    setCliente({ ...cliente, [name]: value });
  };

  const validateForm = () => {
    const requiredFields = id ? ['razonSocial', 'cuit', 'domicilio', 'telefono', 'email', 'provincia', 'localidad', 'ivtCodigo', 'pais', 'idVendedor', 'estado', 'numeroDocumento', 'nroIngresosBrutos', 'celular'] 
                              : ['razonSocial', 'cuit', 'domicilio', 'telefono', 'email', 'provincia', 'localidad', 'ivtCodigo', 'pais', 'idVendedor', 'estado'];
  
    for (let field of requiredFields) {
      if (!cliente[field]) {
        return `El campo ${field} es obligatorio.`;
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
                
                <label htmlFor="provincia" className="form-label">Provincia </label>
                <select
                   id="provincia"
                   name="provincia"
                   className="form-select"
                   value={cliente.provincia}
                   onChange={handleChange}
                 >
                <option value="Buenos Aires">Buenos Aires</option>
                 <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
                 <option value="Catamarca">Catamarca</option>
                 <option value="Chaco">Chaco</option>
                 <option value="Chubut">Chubut</option>
                 <option value="Córdoba">Córdoba</option>
                 <option value="Corrientes">Corrientes</option>
                 <option value="Entre Ríos">Entre Ríos</option>
                 <option value="Formosa">Formosa</option>
                 <option value="Jujuy">Jujuy</option>
                 <option value="La Pampa">La Pampa</option>
                 <option value="La Rioja">La Rioja</option>
                 <option value="Mendoza">Mendoza</option>
                 <option value="Misiones">Misiones</option>
                 <option value="Neuquén">Neuquén</option>
                 <option value="Río Negro">Río Negro</option>
                 <option value="Salta">Salta</option>
                 <option value="San Juan">San Juan</option>
                 <option value="San Luis">San Luis</option>
                 <option value="Santa Cruz">Santa Cruz</option>
                 <option value="Santa Fe">Santa Fe</option>
                 <option value="Santiago del Estero">Santiago del Estero</option>
                 <option value="Tierra del Fuego">Tierra del Fuego</option>
                 <option value="Tucumán">Tucumán</option>
                 </select>

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
                <div className="col-md-6">
                  <label htmlFor="ivtCodigo" className="form-label">Condicion IVA</label>
                  <select
                    id="ivtCodigo"
                    name="ivtCodigo"
                    className="form-select"
                    value={cliente.ivtCodigo}
                    onChange={handleChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="pais" className="form-label">Pais</label>
                  <select
                    id="pais"
                    name="pais"
                    className="form-select"
                    value={cliente.pais}
                    onChange={handleChange}
                  >
                    <option value="Argentina">Argentina</option>
                    <option value="Brasil">Brasil</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Chile">Chile</option>
                    <option value="Bolivia">Bolivia</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="idVendedor" className="form-label">ID vendedor</label>
                  <input
                    type="text"
                    id="idVendedor"
                    name="idVendedor"
                    className="form-control"
                    value={cliente.idVendedor}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="estado" className="form-label">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    className="form-select"
                    value={cliente.estado}
                    onChange={handleChange}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                {/* Hasta aca campos para creacion */}

                {id ? (
                  <>
                  
                 
                <div className="col-md-6">
                  <label htmlFor="numeroDocumento" className="form-label">DNI</label>
                  <input
                    type="text"
                    id="numeroDocumento"
                    name="numeroDocumento"
                    className="form-control"
                    value={cliente.numeroDocumento}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                 <label htmlFor="nroIngresosBrutos" className="form-label">Numero de Ingresos Brutos</label>
                 <input
                   type="text"
                   id="nroIngresosBrutos"
                   name="nroIngresosBrutos"
                   className="form-control"
                   value={cliente.nroIngresosBrutos}
                   onChange={handleChange}
                 />
               </div> 

             
                <div className="col-md-6">
                  <label htmlFor="celular" className="form-label"> Celular</label>
                  <input
                    type="text"
                    id="celular"
                    name="celular"
                    className="form-control"
                    value={cliente.celular}
                    onChange={handleChange}
                  />
                </div>
                </>

) : null}
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
