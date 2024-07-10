import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import './Pedidos.css';
import Footer from './Footer';

const Pedidos = () => {
  const [pedido, setPedido] = useState({
    idUsuario: 1,
    idCliente: '',
    detalles: [{
      idProducto: '',
      descripcion: '',
      cantidad: 0,
      precio: 0,
      descuento: 0,
      precioTotal: 0
    }]
  });

  const [productos, setProductos] = useState([]);
  const token = localStorage.getItem('token');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Este es el token ' + token);
    
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/producto', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setProductos(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    if (id) {
      const fetchPedido = async () => {
        try {
          const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/pedido/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          setPedido(data);
        } catch (error) {
          console.error('Error fetching pedido:', error);
        }
      };

      fetchPedido();
    }

    fetchProductos();
  }, [token, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPedido({ ...pedido, [name]: value });
  };

  const handleDetalleChange = (index, e) => {
    const { name, value } = e.target;
    const newDetalles = [...pedido.detalles];
    newDetalles[index][name] = value;
    if (name === 'cantidad' || name === 'precio' || name === 'descuento') {
      newDetalles[index].precioTotal = calcularPrecioTotal(newDetalles[index]);
    }
    setPedido({ ...pedido, detalles: newDetalles });
  };

  const handleProductoChange = (index, e) => {
    const { value } = e.target;
    const newDetalles = [...pedido.detalles];
    newDetalles[index].idProducto = value;
    const productoSeleccionado = productos.find(p => p.id === parseInt(value));
    if (productoSeleccionado) {
      newDetalles[index].descripcion = productoSeleccionado.descripcion;
      newDetalles[index].precio = productoSeleccionado.precio;
      newDetalles[index].precioTotal = calcularPrecioTotal(newDetalles[index]);
      setPedido({ ...pedido, detalles: newDetalles });
    }
  };

  const calcularPrecioTotal = (detalle) => {
    return (detalle.precio * detalle.cantidad) - (detalle.precio * detalle.cantidad * (detalle.descuento / 100));
  };

  const agregarDetalle = () => {
    setPedido({
      ...pedido,
      detalles: [...pedido.detalles, {
        idProducto: '',
        descripcion: '',
        cantidad: 0,
        precio: 0,
        descuento: 0,
        precioTotal: 0
      }]
    });
  };

  const eliminarDetalle = (index) => {
    const newDetalles = [...pedido.detalles];
    newDetalles.splice(index, 1);
    setPedido({ ...pedido, detalles: newDetalles });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = id 
      ? `http://vps-1915951-x.dattaweb.com:8090/api/v1/pedido/${id}` 
      : 'http://vps-1915951-x.dattaweb.com:8090/api/v1/pedido';
    const method = id ? 'PUT' : 'POST';
    
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(pedido)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(id ? 'Error al editar el pedido' : 'Error al crear el pedido');
      }
      return response.json();
    })
    .then(data => {
      console.log(id ? 'Pedido editado:' : 'Pedido creado:', data);
      navigate('/pedidos');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">{id ? 'Editar Pedido' : 'Crear Pedido'}</h1>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="idUsuario" className="form-label">ID Usuario</label>
                  <input
                    type="text"
                    id="idUsuario"
                    name="idUsuario"
                    className="form-control"
                    value={pedido.idUsuario}
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="idCliente" className="form-label">ID Cliente</label>
                  <input
                    type="text"
                    id="idCliente"
                    name="idCliente"
                    className="form-control"
                    value={pedido.idCliente}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {pedido.detalles.map((detalle, index) => (
                <div className="row mb-3 align-items-end" key={index}>
                  <div className="col-md-2">
                    <label htmlFor={`idProducto-${index}`} className="form-label">ID Producto</label>
                    <select
                      id={`idProducto-${index}`}
                      name="idProducto"
                      className="form-select"
                      value={detalle.idProducto}
                      onChange={(e) => handleProductoChange(index, e)}
                    >
                      <option value="">Seleccione un producto</option>
                      {productos.map(producto => (
                        <option key={producto.id} value={producto.id}>{producto.descripcion}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label htmlFor={`descripcion-${index}`} className="form-label">Descripción</label>
                    <input
                      type="text"
                      id={`descripcion-${index}`}
                      name="descripcion"
                      className="form-control"
                      value={detalle.descripcion}
                      readOnly
                    />
                  </div>
                  <div className="col-md-1">
                    <label htmlFor={`cantidad-${index}`} className="form-label">Cantidad</label>
                    <input
                      type="number"
                      id={`cantidad-${index}`}
                      name="cantidad"
                      className="form-control"
                      value={detalle.cantidad}
                      onChange={(e) => handleDetalleChange(index, e)}
                    />
                  </div>
                  <div className="col-md-2">
                    <label htmlFor={`precio-${index}`} className="form-label">Precio</label>
                    <input
                      type="number"
                      id={`precio-${index}`}
                      name="precio"
                      className="form-control"
                      value={detalle.precio}
                      readOnly
                    />
                  </div>
                  <div className="col-md-1">
                    <label htmlFor={`descuento-${index}`} className="form-label">Descuento (%)</label>
                    <input
                      type="number"
                      id={`descuento-${index}`}
                      name="descuento"
                      className="form-control"
                      value={detalle.descuento}
                      onChange={(e) => handleDetalleChange(index, e)}
                    />
                  </div>
                  <div className="col-md-2">
                    <label htmlFor={`precioTotal-${index}`} className="form-label">Precio Total</label>
                    <input
                      type="text"
                      id={`precioTotal-${index}`}
                      name="precioTotal"
                      className="form-control"
                      value={detalle.precioTotal}
                      readOnly
                    />
                  </div>
                  <div className="col-md-1 d-flex align-items-end">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => eliminarDetalle(index)}
                        className="btn btn-danger"
                      >x</button>
                    )}
                  </div>
                </div>
              ))}
              <div className="row">
                <div className="col-md-12 text-end">
                  <button type="button" onClick={agregarDetalle} className="btn btn-secondary">Agregar Producto</button>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-md-12 text-center">
                  <button type="submit" className="btn btn-primary">{id ? 'Guardar Cambios' : 'Guardar Pedido'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </>
  );
};

export default Pedidos;
