import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import './Proveedores.css';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../Others/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Proveedores = () => {
  const [proveedor, setProveedor] = useState({
    razonSocial: '',
    cuit: '',
    domicilio: '',
    telefono: '',
    email: '',
    provincia: '',
    localidad: '',
    ivtCodigo:'', 
    pais: 'Argentina', 
    tipoProveedor: '', 
    estado: "Activo",
    referencia:'',
    celular:'',
    transporte:'',
    cuentaBancaria:'',
    nroIngresosBrutos:'',
    tipoCuenta:'',
    cbu1:'',
    bancoCodigo1:'',
    tipoCuenta2:'',
    cbu2:'',
    bancoCodigo2:'',
    depCodigo:'0',
    esBanco:false,
    esProveedor:true,
    esGasto:false
  });
  const [proveedores, setProveedores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener todos los proveedores
    const fetchProveedores = async () => {
      try {
        const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
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
          console.log(JSON.stringify(data));
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
    console.log("Proveedor " + proveedor);
  };

  const validateForm = () => {
    // Lista de campos requeridos en función de si se está creando o editando un proveedor
    const requiredFields = id
      ? ['razonSocial', 'cuit', 'domicilio', 'telefono', 'email', 'provincia', 'localidad', 'ivtCodigo', 'pais', 'tipoProveedor', 'estado', 'referencia', 'celular', 'transporte', 'cuentaBancaria', 'nroIngresosBrutos', 'tipoCuenta', 'cbu1', 'bancoCodigo1', 'tipoCuenta2', 'cbu2', 'bancoCodigo2']
      : ['razonSocial', 'cuit', 'domicilio', 'telefono', 'email', 'provincia', 'localidad', 'ivtCodigo', 'pais', 'tipoProveedor', 'estado'];
  
    for (let field of requiredFields) {
      if (!proveedor[field]) {
        return `El campo ${field} es obligatorio.`;
      }
    }

    // Validar si el CUIT ya existe
    if (!id && proveedores.some(p => p.cuit === proveedor.cuit)) {
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
      toast.success(id ? 'Proveedor editado con éxito' : 'Proveedor creado con éxito'); // Notificación de éxito

      setShowModal(true);
    })
    .catch(error => {
      console.error('Error:', error);
      toast.error(id ? 'Error al editar el proveedor' : 'Error al crear el proveedor'); // Mostrar error en el toast

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
      <br/>
      <br/>
      <br/>

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
                {/* <div className="col-md-6">
                  <label htmlFor="provincia" className="form-label">Provincia</label>
                  <input
                    type="text"
                    id="provincia"
                    name="provincia"
                    className="form-control"
                    value={proveedor.provincia}
                    onChange={handleChange}
                  />
                </div> */}
                <div className="col-md-6">
                
                <label htmlFor="provincia" className="form-label">Provincia </label>
                <select
                   id="provincia"
                   name="provincia"
                   className="form-select"
                   value={proveedor.provincia}
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
                <div className="col-md-6">
                  <label htmlFor="ivtCodigo" className="form-label">Condicion IVA</label>
                  <select
                    id="ivtCodigo"
                    name="ivtCodigo"
                    className="form-select"
                    value={proveedor.ivtCodigo}
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
                    id="condicionIva"
                    name="condicionIva"
                    className="form-select"
                    value={proveedor.pais}
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
                  <label htmlFor="tipoProveedor" className="form-label">Tipo Proveedor</label>
                  <select
                    id="tipoProveedor"
                    name="tipoProveedor"
                    className="form-select"
                    value={proveedor.tipoProveedor}
                    onChange={handleChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="estado" className="form-label">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    className="form-select"
                    value={proveedor.estado}
                    onChange={handleChange}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                {/* Hasta aca para crear nuevo proveedor- desde aca para editar */}
                {id ? 
              ( <>  <div className="col-md-6">
                 <label htmlFor="referencia" className="form-label">Nombre de contacto para compras</label>
                 <input
                   type="text"
                   id="referencia"
                   name="referencia"
                   className="form-control"
                   value={proveedor.referencia}
                   onChange={handleChange}
                 />
               </div>
               <div className="col-md-6">
                 <label htmlFor="celular" className="form-label">Teléfono para contacto</label>
                 <input
                   type="text"
                   id="celular"
                   name="celular"
                   className="form-control"
                   value={proveedor.celular}
                   onChange={handleChange}
                 />
               </div>
               <div className="col-md-6">
                 <label htmlFor="transporte" className="form-label">Transporte</label>
                 <input
                   type="text"
                   id="transporte"
                   name="transporte"
                   className="form-control"
                   value={proveedor.transporte}
                   onChange={handleChange}
                 />
               </div> 
               <div className="col-md-6">
                 <label htmlFor="cuentaBancaria" className="form-label">Cuenta Bancaria</label>
                 <input
                   type="text"
                   id="cuentaBancaria"
                   name="cuentaBancaria"
                   className="form-control"
                   value={proveedor.cuentaBancaria}
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
                   value={proveedor.nroIngresosBrutos}
                   onChange={handleChange}
                 />
               </div> 

               <div className="col-md-6">
                 <label htmlFor="tipoCuenta" className="form-label">Tipo Cuenta</label>
                 <input
                   type="text"
                   id="tipoCuenta"
                   name="tipoCuenta"
                   className="form-control"
                   value={proveedor.tipoCuenta}
                   onChange={handleChange}
                 />
               </div> 
               <div className="col-md-6">
                 <label htmlFor="cbu1" className="form-label">CBU 1 </label>
                 <input
                   type="text"
                   id="cbu1"
                   name="cbu1"
                   className="form-control"
                   value={proveedor.cbu1}
                   onChange={handleChange}
                 />
               </div> 
               <div className="col-md-6">
                  <label htmlFor="bancoCodigo1" className="form-label">Codigo de Banco</label>
                  <input
                    type="bancoCodigo1"
                    id="bancoCodigo1"
                    name="bancoCodigo1"
                    className="form-control"
                    value={proveedor.bancoCodigo1}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="col-md-6">
                 <label htmlFor="tipoCuenta2" className="form-label">Tipo Cuenta 2</label>
                 <input
                   type="text"
                   id="tipoCuenta2"
                   name="tipoCuenta2"
                   className="form-control"
                   value={proveedor.tipoCuenta2}
                   onChange={handleChange}
                 />
               </div> 
               <div className="col-md-6">
                 <label htmlFor="cbu2" className="form-label">CBU 2 </label>
                 <input
                   type="text"
                   id="cbu2"
                   name="cbu2"
                   className="form-control"
                   value={proveedor.cbu2}
                   onChange={handleChange}
                 />
               </div> 
               <div className="col-md-6">
                  <label htmlFor="bancoCodigo2" className="form-label">Codigo de Banco 2</label>
                  <input
                    type="bancoCodigo2"
                    id="bancoCodigo2"
                    name="bancoCodigo2"
                    className="form-control"
                    value={proveedor.bancoCodigo2}
                    onChange={handleChange}
                  />
                </div>
               </>)
                :
                null
                }
               
               
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
      <ToastContainer />


      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{id ? 'Proveedor Editado' : 'Proveedor Creado'}</h5>
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
    </>
  );
};

export default Proveedores;
