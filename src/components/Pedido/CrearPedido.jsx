import React, { useState, useEffect } from "react";
import Navbar from "../Others/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import "./CrearPedido.css";
import Footer from "../Others/Footer";
import Select from "react-select";
import ClientDetails from '../Factura/ClientDetails';
import { Container, Button, Form, Modal } from 'react-bootstrap';

const CrearPedido = () => {
  const [productos, setProductos] = useState([
    {
      codigo: "",
      descripcion: "",
      cantidad: 0,
      precioVenta: 0,
      descuento: 0,
      total: 0,
      removable: true,
    },
  ]);

  const [clienteDetails, setClienteDetails] = useState({
    cuit: '',
    condicionIva: '',
    condicionVenta: '',
    razonSocial: '',
    domicilio: ''
  });

  const [productosAPI, setProductosAPI] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState("");
  const [selectedClienteId, setSelectedClienteId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [descuentoGeneral, setDescuentoGeneral] = useState(0); // Estado para el descuento general
  const [zona, setSelectZona] = useState('');

  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductosAPI = async () => {
      try {
        const response = await fetch(
          "http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/cliente/2",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener los productos de la API");
        }
        const data = await response.json();
        setProductosAPI(data);
      } catch (error) {
        console.error("Error fetching productosAPI:", error);
      }
    };

    fetchProductosAPI();
  }, [token]);

  useEffect(() => {
    if (id) {
      const fetchPedido = async () => {
        try {
          const response = await fetch(
            `http://vps-1915951-x.dattaweb.com:8090/api/v1/pedido/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Error al obtener el pedido");
          }
          const data = await response.json();
          setPedidoId(data.id);
          setIsEditing(true);
          setSelectedClienteId(data.idCliente);
          const cliente = await fetch(
            `http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/${data.idCliente}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const clienteData = await cliente.json();
          setSelectedCliente(clienteData.razonSocial);
          const detalles = data.pedidoDetalles.map((detalle) => {
            const producto = detalle.producto;
            return {
              codigo: producto.codigo,
              descripcion: producto.descripcion,
              cantidad: detalle.cantidad,
              precio: producto.precioVenta,
              descuento: detalle.descuento,
              total: detalle.total,
              removable: true,
            };
          });
          setProductos(detalles);
        } catch (error) {
          console.error("Error fetching pedido:", error);
        }
      };

      fetchPedido();
    }
  }, [id]);

  // const handleProductoChange = (index, field, value) => {
  //   const newProductos = [...productos];
  //   const selectedProducto = productosAPI.find(
  //     (producto) => producto[field] === value
  //   );
  //   if (selectedProducto) {
  //     newProductos[index].codigo = selectedProducto.codigo;
  //     newProductos[index].descripcion = selectedProducto.descripcion;
  //     newProductos[index].precio = selectedProducto.costo;
  //   } else {
  //     newProductos[index][field] = value;
  //     if (field === "codigo") {
  //       newProductos[index].descripcion = "";
  //     } else {
  //       newProductos[index].codigo = "";
  //     }
  //     newProductos[index].precio = 0;
  //   }
  //   setProductos(newProductos);
  // };

  const handleCodigoChange = (index, selectedOption) => {
    const newProductos = [...productos];
    const selectedProducto = productosAPI.find(producto => producto.codigo === selectedOption.value);
    console.log(selectedProducto);
    if (selectedProducto) {
      newProductos[index].codigo = selectedProducto.codigo;
      newProductos[index].descripcion = selectedProducto.descripcion;
      newProductos[index].precioVenta = selectedProducto.precioVenta;
    } else {
      newProductos[index].codigo = selectedOption.value;
      newProductos[index].descripcion = '';
      newProductos[index].precioVenta = 0;
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
    producto.total = ((producto.precioVenta - (producto.precioVenta * (producto.descuento / 100))) * producto.cantidad).toFixed(2);
  
    return (producto.precioVenta - (producto.precioVenta * (producto.descuento / 100))) * producto.cantidad;
  };

  const calcularSumaTotal = () => {
    const sumaSinDescuento = productos.reduce((acc, producto, index) => {
      const precioTotal = calcularPrecioTotal(index);
      return acc + (precioTotal ? precioTotal : 0);
    }, 0);

    const descuento = sumaSinDescuento * (descuentoGeneral / 100);
    const sumaConDescuento = sumaSinDescuento - descuento;

    return sumaConDescuento.toFixed(2);
  };

  const agregarProducto = () => {
    const productosValidos = productos.every(producto => producto.codigo && producto.descripcion && producto.cantidad > 0);
    if (!productosValidos) {
      alert("Por favor complete todos los datos de los productos antes de agregar otro.");
      return;
    }
    const newProductos = productos.map(producto => ({
      ...producto,
      removable: true
    }));
    setProductos([...newProductos, {
      codigo: '',
      descripcion: '',
      cantidad: 1,
      precioVenta: 0,
      descuento: 0,
      total: 0,
      removable: true
    }]);
  };

  const eliminarProducto = (index) => {
    const newProductos = [...productos];
    newProductos.splice(index, 1);
    setProductos(newProductos);
  };

  const handleConfirmarVenta = () => {
    const productosCompletos = productos.every(
      (producto) =>
        producto.codigo &&
        producto.descripcion &&
        producto.cantidad > 0 &&
        producto.precioVenta > 0
    );
    if (!productosCompletos) {
      setValidationError(
        "Por favor asegúrese de que todos los productos tengan todos los datos completos."
      );
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

    setValidationError("");
    setShowConfirmModal(true);
  };

  

  const confirmarGuardarPedido = async () => {
    const detalles = productos
      .map((producto) => ({
        idProducto: productosAPI.find((p) => p.codigo === producto.codigo)?.id,
        cantidad: producto.cantidad,
        descuento: producto.descuento,
        total: producto.total,
      }))
      .filter((detalle) => detalle.idProducto && detalle.cantidad);

    const pedido = {
      idUsuario: 1,
      idCliente: selectedClienteId,
      detalles,
    };

    console.log("Esto hay en pedido" + JSON.stringify(pedido));

    try {
      const response = await fetch(
        isEditing
          ? `http://vps-1915951-x.dattaweb.com:8090/api/v1/pedido/${pedidoId}`
          : "http://vps-1915951-x.dattaweb.com:8090/api/v1/pedido",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pedido),
        }
      );
      if (!response.ok) {
        throw new Error("Error al confirmar la venta");
      }
      setShowConfirmModal(false);
      setShowModal(true);
    } catch (error) {
      console.error("Error confirming venta:", error);
    }
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch(
          "http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener los clientes");
        }
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error("Error fetching clientes:", error);
      }
    };

    fetchClientes();
  }, []);

 

  const handleClienteSelect = (selectedOption) => {
    const cliente = clientes.find(c => c.id === selectedOption.value);
    setSelectedClienteId(cliente.id);
    setSelectedCliente(cliente.razonSocial);
    setSelectZona(cliente.zona.id);

    // Actualizar los detalles del cliente en los campos de solo lectura
    setClienteDetails({
      cuit: cliente.cuit || '',
      condicionIva: cliente.condicionIva || '',
      condicionVenta: cliente.condicionVenta || '',
      razonSocial: cliente.razonSocial || '',
      domicilio: cliente.domicilio || ''
    });
  };


  const clienteOptions = clientes.map(cliente => ({
    value: cliente.id,
    label: cliente.razonSocial
  }));

  const handleDescuentoGeneralChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setDescuentoGeneral(value);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/pedidos");
  };

  const productOptionsCod = productosAPI.map(producto => ({
    value: producto.codigo,
    label: `${producto.codigo} `
  }));

  const productOptionsDes = productosAPI.map(producto => ({
    value: producto.codigo,
    label: `${producto.descripcion}`
  }));

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <br />
      <div className="container-principal">
        <h1>{isEditing ? "Editar Pedido" : "Crear Nuevo Pedido"}</h1>
        <button className="btn btn-secondary mb-3" onClick={handleBack}>
          Volver Atrás
        </button>
        <br />
        {validationError && (
          <div className="alert alert-danger">{validationError}</div>
        )}

        {id ? (
          <h1> Cliente : {selectedCliente}</h1>
        ) : (
          <Select
            options={clienteOptions}
            onChange={handleClienteSelect}
            placeholder="Buscar cliente"
          />
        )}

{selectedCliente && (
         <ClientDetails selectedCliente={selectedCliente} clienteDetails={clienteDetails} />
)}
        {/* Aquí se añade el nuevo campo para el descuento general */}
        <div className="input-row">
          <div className="input-container-descuento">
            <label htmlFor="descuento-general">Descuento General (%):</label>
            <input
              type="number"
              id="descuento-general"
              value={descuentoGeneral}
              onChange={handleDescuentoGeneralChange}
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>
      <br />
      <div className="input-row"></div>
      <br />
      <hr />
      <br />
      {productos.map((producto, index) => (
          <div className="input-row" key={index}>
            <div className="input-container small">
              <label htmlFor={`codigo-${index}`}>Código  </label>
              <Select
                className="fixed-select"
                options={productOptionsCod}
                value={productOptionsCod.find(option => option.value === producto.codigo)}
                onChange={(selectedOption) => handleCodigoChange(index, selectedOption)}
                placeholder="Seleccione un código"
                isDisabled={!selectedClienteId}              />
            </div>

            <div className="input-container large">
              <label htmlFor={`descripcion-${index}`}>Descripción </label>
              <Select
              className="fixed-select"
                options={productOptionsDes}
                value={productOptionsDes.find(option => option.value === producto.codigo)}
                onChange={(selectedOption) => handleCodigoChange(index, selectedOption)}
                placeholder="Seleccione una descripción"
                isDisabled={!selectedClienteId}              />
            </div>

            <div className="input-container xsmall">
              <label htmlFor={`cantidad-${index}`}>Cantidad </label>
              <input
                className='camps-tama-cant'
                type="number"
                id={`cantidad-${index}`}
                name="cantidad"
                value={producto.cantidad}
                onChange={(e) => handleInputChange(index, e)}
                min="1"
                disabled={!selectedClienteId} // Deshabilitar si no hay cliente seleccionado
              />
            </div>

            <div className="input-container xsmall">
              <label htmlFor={`precio-${index}`}>Precio </label>
              <input
                className='camps-tama'
                type="number"
                id={`precio-${index}`}
                name="precioVenta"
                value={producto.precioVenta}
                readOnly
                disabled={!selectedClienteId} // Deshabilitar si no hay cliente seleccionado
              />
            </div>

            <div className="input-container">
              <label htmlFor={`descuento-${index}`}>Dto(%)</label>
              <input
                type="number"
                id={`descuento-${index}`}
                name="descuento"
                value={producto.descuento}
                onChange={(e) => handleInputChange(index, e)}
                disabled={!selectedClienteId} // Deshabilitar si no hay cliente seleccionado
                min={0}
                max={100}
              />
            </div>

            <div className="input-container">
              <label htmlFor={`precioTotal-${index}`}>Precio Total:</label>
              <input
                type="number"
                id={`precioTotal-${index}`}
                value={calcularPrecioTotal(index) === null ? 'Completar cantidad por favor' : calcularPrecioTotal(index).toFixed(2)}
                readOnly
                disabled={!selectedClienteId} // Deshabilitar si no hay cliente seleccionado
              />
            </div>

            {producto.removable && (
              <div className="text-end">
                <Button
                  variant="danger"
                  onClick={() => eliminarProducto(index)}
                  className="shadow-sm"
                >
                  x
                </Button>
              </div>
            )}
          </div>
        ))}
      <div className="input-row">
        <Button
          variant="primary"
          onClick={agregarProducto}
          className="mb-4 shadow-sm"
        >
         +
        </Button>
        </div>
      <hr />
      <div className="bottom-controls">
        <h2>Precio Total: {calcularSumaTotal()}</h2>
        <div className="button-container">
          <button onClick={handleConfirmarVenta} className="confirm-button">
            {isEditing ? "Actualizar Pedido" : "Guardar Pedido"}
          </button>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>

      {showModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Pedido Confirmado</h5>
              </div>
              <div className="modal-body">
                <p>El pedido se ha confirmado con éxito.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Guardado</h5>
              </div>
              <div className="modal-body">
                <p>¿Está seguro de que desea guardar el pedido?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={confirmarGuardarPedido}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearPedido;
