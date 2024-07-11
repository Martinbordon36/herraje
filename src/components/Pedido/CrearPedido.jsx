import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import Autosuggest from 'react-autosuggest';
import { useNavigate, useParams } from 'react-router-dom';
import './CrearPedido.css';
import Footer from '../Others/Footer';

const CrearPedido = () => {
  const [productos, setProductos] = useState([{
    codigo: '',
    descripcion: '',
    cantidad: 0,
    precio: 0,
    removable: false
  }]);
  
  const [productosAPI, setProductosAPI] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedClienteId, setSelectedClienteId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState('');

  const token = localStorage.getItem('token');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductosAPI = async () => {
      try {
        const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/producto', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Error al obtener los productos de la API');
        }
        const data = await response.json();
        setProductosAPI(data);
      } catch (error) {
        console.error('Error fetching productosAPI:', error);
      }
    };

    fetchProductosAPI();
  }, [token]);

  useEffect(() => {
    if (id) {
      const fetchPedido = async () => {
        try {
          const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/pedido/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error('Error al obtener el pedido');
          }
          const data = await response.json();
          setPedidoId(data.id);
          setIsEditing(true);
          setSelectedClienteId(data.idCliente);
          const cliente = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/${data.idCliente}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const clienteData = await cliente.json();
          setSelectedCliente(clienteData.razonSocial);
          const detalles = data.pedidoDetalles.map(detalle => {
            const producto = detalle.producto;
            return {
              codigo: producto.codigo,
              descripcion: producto.descripcion,
              cantidad: detalle.cantidad,
              precio: producto.costo,
              removable: true
            };
          });
          setProductos(detalles);
        } catch (error) {
          console.error('Error fetching pedido:', error);
        }
      };

      fetchPedido();
    }
  }, [id]);

  const handleCodigoChange = (index, e) => {
    const newProductos = [...productos];
    const selectedProducto = productosAPI.find(producto => producto.codigo === e.target.value);
    if (selectedProducto) {
      newProductos[index].codigo = selectedProducto.codigo;
      newProductos[index].descripcion = selectedProducto.descripcion;
      newProductos[index].precio = selectedProducto.costo;
    } else {
      newProductos[index].codigo = e.target.value;
      newProductos[index].descripcion = '';
      newProductos[index].precio = 0;
    }
    setProductos(newProductos);
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newProductos = [...productos];
    newProductos[index][name] = parseFloat(value);
    setProductos(newProductos);
  };

  const calcularPrecioTotal = (index) => {
    const producto = productos[index];
    if (producto.cantidad === 0 || !producto.cantidad) {
      return null;
    }
    return producto.precio * producto.cantidad;
  };

  const calcularSumaTotal = () => {
    return productos.reduce((acc, producto, index) => {
      const precioTotal = calcularPrecioTotal(index);
      return acc + (precioTotal ? precioTotal : 0);
    }, 0).toFixed(2);
  };

  const agregarProducto = () => {
    const primerProductoCompleto = productos[0].codigo && productos[0].descripcion && productos[0].cantidad > 0;
    if (!primerProductoCompleto) {
      alert("Por favor complete todos los datos del primer producto antes de agregar otro.");
      return;
    }
    const newProductos = productos.map(producto => ({
      ...producto,
      removable: true
    }));
    setProductos([...newProductos, {
      codigo: '',
      descripcion: '',
      cantidad: 0,
      precio: 0,
      removable: false
    }]);
  };

  const eliminarProducto = (index) => {
    const newProductos = [...productos];
    newProductos.splice(index, 1);
    setProductos(newProductos);
  };

  const handleConfirmarVenta = async () => {
    const productosCompletos = productos.every(producto => producto.codigo && producto.descripcion && producto.cantidad > 0 && producto.precio > 0);
    if (!productosCompletos) {
      setValidationError("Por favor asegúrese de que todos los productos tengan todos los datos completos.");
      return;
    }
    if (productos.length === 0) {
      setValidationError("Debe agregar al menos un producto.");
      return;
    }
    if (!selectedClienteId) {
      setValidationError("Por favor seleccione un cliente.");
      return;
    }

    setValidationError('');

    const detalles = productos.map(producto => ({
      idProducto: productosAPI.find(p => p.codigo === producto.codigo)?.id,
      cantidad: producto.cantidad
    })).filter(detalle => detalle.idProducto && detalle.cantidad);

    const pedido = {
      idUsuario: 1,
      idCliente: selectedClienteId,
      detalles
    };

    try {
      const response = await fetch(isEditing ? `http://vps-1915951-x.dattaweb.com:8090/api/v1/pedido/${pedidoId}` : 'http://vps-1915951-x.dattaweb.com:8090/api/v1/pedido', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
      });
      if (!response.ok) {
        throw new Error('Error al confirmar la venta');
      }
      const data = await response.json();
      console.log('Venta confirmada:', data);
      setShowModal(true);
    } catch (error) {
      console.error('Error confirming venta:', error);
    }
  };

  useEffect(() => {
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
  }, []);

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : clientes.filter(cliente =>
      cliente.razonSocial.toLowerCase().includes(inputValue)
    );
  };

  const getSuggestionValue = (suggestion) => suggestion.razonSocial;

  const renderSuggestion = (suggestion) => (
    <div>
      {suggestion.razonSocial}
    </div>
  );

  const handleClienteSelect = (event, { suggestion }) => {
    setSelectedCliente(suggestion.razonSocial);
    setSelectedClienteId(suggestion.id);
    setSearchTerm(suggestion.razonSocial);
  };

  const inputProps = {
    placeholder: "Buscar cliente",
    value: searchTerm,
    onChange: (e, { newValue }) => {
      setSearchTerm(newValue);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/pedidos');
  };

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <div className='container-principal'>
        <h1>{isEditing ? 'Editar Pedido' : 'Crear Nuevo Pedido'}</h1>
        <button className="btn btn-secondary mb-3" onClick={handleBack}>Volver Atrás</button>
        <br />
        {validationError && <div className="alert alert-danger">{validationError}</div>}
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={handleSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={handleClienteSelect}
          theme={{
            container: 'autosuggest__container',
            input: 'autosuggest__input',
            suggestionsContainer: 'autosuggest__suggestions-container',
            suggestion: 'autosuggest__suggestion',
            suggestionHighlighted: 'autosuggest__suggestion--highlighted'
          }}
        />
        <br />
        <br />
        <hr />
      </div>
      <br />
      <div className="input-row">
        <div className="input-container">
          <label htmlFor="cliente"> Cliente:</label>
          <input className='input-defecto' type="text" id="cliente" value={selectedCliente} readOnly />
        </div>
      </div>
      <br />
      <hr />
      <br />
      {productos.map((producto, index) => (
        <div className="input-row" key={index}>
          <div className="input-container small">
            <label htmlFor={`codigo-${index}`}>Código:  </label>
            <select id={`codigo-${index}`} value={producto.codigo} onChange={(e) => handleCodigoChange(index, e)}>
              <option value="">Seleccione un código</option>
              {productosAPI.map((productoAPI) => (
                <option key={productoAPI.id} value={productoAPI.codigo}>
                  {productoAPI.codigo}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container large">
            <label htmlFor={`descripcion-${index}`}> Descripción:</label>
            <input type="text" id={`descripcion-${index}`} value={producto.descripcion} readOnly />
          </div>
          <div className="input-container xsmall">
            <label htmlFor={`cantidad-${index}`}> Cantidad:</label>
            <input type="number" id={`cantidad-${index}`} name="cantidad" value={producto.cantidad} onChange={(e) => handleInputChange(index, e)} />
          </div>
          <div className="input-container xsmall">
            <label htmlFor={`precio-${index}`}>Precio:</label>
            <input type="number" id={`precio-${index}`} name="precio" value={producto.precio} readOnly />
          </div>
          <div className="input-container">
            <label htmlFor={`precioTotal-${index}`}>Precio Total:</label>
            <input type="text" id={`precioTotal-${index}`} value={calcularPrecioTotal(index) === null ? 'Completar cantidad por favor' : calcularPrecioTotal(index).toFixed(2)} readOnly />
          </div>
          {producto.removable && (
            <button onClick={() => eliminarProducto(index)}>x</button>
          )}
        </div>
      ))}
      <div className="input-row">
        <button onClick={agregarProducto} className='button-add-product'>Agregar Producto</button>
      </div>
      <hr />
      <div className="bottom-controls">
        <h2>Precio Total: {calcularSumaTotal()}</h2>
        <div className="button-container">
          <button onClick={handleConfirmarVenta} className="confirm-button">{isEditing ? 'Actualizar Pedido' : 'Confirmar Venta'}</button>
        </div>
      </div>

      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Pedido Confirmado</h5>
              </div>
              <div className="modal-body">
                <p>El pedido se ha confirmado con éxito.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <Footer/> */}
    </div>
  );
}

export default CrearPedido;
