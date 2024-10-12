import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import './CoeficienteScreen.css';
import search from '../../assets/lupa.png';

const CoeficienteScreen = () => {
  const [coeficientes, setCoeficientes] = useState([]);
  const [filteredCoeficientes, setFilteredCoeficientes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);  // Estado para alternar entre vista y edición
  const [proveedores, setProveedores] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false); // Estado para mostrar/ocultar modal de creación
  const [newCoeficiente, setNewCoeficiente] = useState({
    idProveedor: '',
    idZona: '',
    coeficienteTotal: '',
    descripcionCoeficiente: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  
  const token = localStorage.getItem('token');

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

  }, [token]);

  // Función para manejar cambios en la descripción del coeficiente
  const handleDescripcionChange = (e, id) => {
    const newDescripcion = e.target.value;
    const updatedCoeficientes = coeficientes.map(coef => {
      if (coef.id === id) {
        const nuevoCoeficienteTotal = calcularCoeficienteTotal(newDescripcion);
        return { ...coef, detalleCoeficientes: newDescripcion, coeficienteTotal: nuevoCoeficienteTotal };
      }
      return coef;
    });
    setCoeficientes(updatedCoeficientes);
    setFilteredCoeficientes(updatedCoeficientes);
  };

  // Función para calcular el coeficiente total basado en la descripción (sumas y restas)
  const calcularCoeficienteTotal = (descripcion) => {
    let total = 1;
    let sumaPartes = descripcion.split('+'); // Separar por sumas
    sumaPartes.forEach(sumaParte => {
      let restaPartes = sumaParte.split('-'); // Separar cada suma por restas
      let subtotal = 1;
      restaPartes.forEach((parte, index) => {
        const valor = parseFloat(parte.replace(",", "."));
        if (index === 0) {
          subtotal *= (1 + valor / 100); // Sumar porcentaje
        } else {
          subtotal /= (1 + valor / 100); // Restar porcentaje
        }
      });
      total *= subtotal;
    });
    return total.toFixed(4); // Ajusta el número de decimales según sea necesario
  };

  // Función para guardar los cambios en el servidor
  const saveChanges = async (id, proveedor, zona, coeficienteTotal, detalleCoeficientes) => {
    const updatedData = [{
      idCoeficiente: id,
      idProveedor: proveedor,
      idZona: zona,
      coeficienteTotal: coeficienteTotal,
      descripcionCoeficiente: detalleCoeficientes
    }];

    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/coeficiente`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData) // Enviar el arreglo de objetos
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el coeficiente');
      }

      alert('Coeficiente actualizado con éxito');
    } catch (error) {
      console.error('Error updating coeficiente:', error);
    }
  };


  const handleCreateCoeficiente = () => {
    setShowCreateModal(true); // Mostrar modal de creación
  };
  const handleNewCoeficienteChange = (e) => {
    const { name, value } = e.target;
    setNewCoeficiente(prevState => ({
      ...prevState,
      [name]: value,
      coeficienteTotal: name === 'descripcionCoeficiente' ? calcularCoeficienteTotal(value) : prevState.coeficienteTotal
    }));
  };
  const createCoeficiente = async () => {
    const newCoeficienteData = {
      idCoeficiente:999,
      idProveedor: newCoeficiente.idProveedor,
      idZona: newCoeficiente.idZona,
      coeficienteTotal: newCoeficiente.coeficienteTotal,
      descripcionCoeficiente: newCoeficiente.descripcionCoeficiente
    };

    console.log(newCoeficienteData);

    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/coeficiente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCoeficienteData)
      });
      console.log(newCoeficienteData)

      if (!response.ok) {
        const errorDetails = await response.json(); // Intentar obtener el cuerpo de la respuesta en formato JSON
        throw new Error(`Error al crear el coeficiente: ${response.status} - ${errorDetails.message || 'Detalles no disponibles'}`);
      }

      alert('Coeficiente creado con éxito');
      setIsCreating(false); // Cerrar modal después de la creación
    } catch (error) {
      console.error('Error creating coeficiente:', error);
    }
  };

  const handleSearch = () => {
    setFilteredCoeficientes(
      coeficientes.filter((coef) =>
        coef.proveedor.razonSocial.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <>
      <Navbar />
      <br/>
      <div className="container">
        <h1 className="title">Coeficientes</h1>
        {/* Botón para alternar entre modo de vista y edición */}
        
        <div className='container-botones'>
        <button className="button" onClick={handleCreateCoeficiente}>Crear Coeficiente</button>

        <button onClick={() => setIsEditing(!isEditing)} className='button-edit'>
          {isEditing ? 'Ver' : 'Editar'}
        </button>
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

      </div>



      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="th">Proveedor</th>
              <th className="th">Zona</th>
              <th className="th">Coeficiente</th>
              <th className="th">Descripción Coeficiente</th>
              {isEditing && <th className="th">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {filteredCoeficientes && filteredCoeficientes.map((coeficiente) => (
              <tr key={coeficiente.id}>
                <td className="td">{coeficiente.proveedor.razonSocial}</td>
                <td className="td">{coeficiente.zona.nombre}</td>
                <td className="td">{coeficiente.coeficienteTotal}</td>
                <td className="td">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={coeficiente.detalleCoeficientes || ""} 
                      onChange={(e) => handleDescripcionChange(e, coeficiente.id)}
                    />
                  ) : (
                    coeficiente.detalleCoeficientes
                  )}
                </td>
                {isEditing && (
                  <td>
                    <button onClick={() => saveChanges(coeficiente.id, coeficiente.proveedor.id, coeficiente.zona.id, coeficiente.coeficienteTotal, coeficiente.detalleCoeficientes)}
                       className='button-guardar'
                      >
                      Guardar
                    </button>
                  </td>
                )}
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
                <h5 className="modal-title">Crear Coeficiente</h5>
              </div>
              <div className="modal-body">
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
                <label>Descripción Coeficiente:</label>
            <input
              type="text"
              name="descripcionCoeficiente"
              value={newCoeficiente.descripcionCoeficiente}
              onChange={handleNewCoeficienteChange}
            />
            <label>Coeficiente Total:</label>
            <input
              type="text"
              name="coeficienteTotal"
              value={newCoeficiente.coeficienteTotal}
              readOnly
            />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={createCoeficiente}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default CoeficienteScreen;
