import React, { useState, useEffect } from "react";
import Navbar from "../Others/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import "./Conversor.css";
import Footer from "../Others/Footer";
import ClientDetails from "../Factura/ClientDetails";
import { Container, Button, Form, Modal } from 'react-bootstrap';

const Conversor = () => {
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

  const [productosAPI, setProductosAPI] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState("");
  const [selectedClienteId, setSelectedClienteId] = useState("");
  const [zona, setSelectZona] = useState("");

  const [clienteDetails, setClienteDetails] = useState({
    cuit: "",
    condicionIva: "",
    condicionVenta: "",
    razonSocial: "",
    domicilio: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [descuentoGeneral, setDescuentoGeneral] = useState(0);
  const [descuentoEspecial, setDescuentoEspecial] = useState(false);
  const [factura, setFactura] = useState({
    descuentoGeneral: "0",
    descuentoEspecial: false,
    tipoFactura: "1",
    gravado: "0", //sub total
    exento: "0",
    iva: 21.5,
    total: "0",
  });

  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();

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
  
          // Recupere los datos del cliente
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
          setSelectZona(clienteData.zona.id);
          
          setClienteDetails({
            cuit: clienteData.cuit || "",
            condicionIva: clienteData.condicionIva || "",
            condicionVenta: clienteData.condicionVenta || "",
            razonSocial: clienteData.razonSocial || "",
            domicilio: clienteData.domicilio || "",
          });
  
          // Recuperar los productos después de haber recuperado la zona
          if (clienteData.zona.id) {
            const responseProductos = await fetch(
              `http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/cliente/${clienteData.zona.id}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (!responseProductos.ok) {
              throw new Error("Error al obtener los productos de la API");
            }
            const productosData = await responseProductos.json();
            setProductosAPI(productosData);
          }
  
          // Recuperamos el pedido
          const detalles = data.pedidoDetalles.map((detalle) => {
            const producto = detalle.producto;
            console.log(producto);
            return {
              codigo: producto.codigo,
              descripcion: producto.descripcion,
              cantidad: detalle.cantidad,
              precioVenta: producto.precioVenta,
              descuento: detalle.descuento,
              total: detalle.total,
              removable: true,
            };
          });
          console.log(detalles);

          setProductos(detalles);
        } catch (error) {
          console.error("Error fetching pedido:", error);
        }
      };
      fetchPedido();
    }
  }, [id]);
  

{/* Obtenemos los productos   */}

      useEffect(() => {
        const fetchProductosAPI = async () => {
          console.log(zona);
          try {
            const response = await fetch(
              `http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/cliente/${zona}`,
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
      }, [selectedCliente]);
    

  const handleCodigoChange = (index, selectedOption) => {
    const newProductos = [...productos];
    const selectedProducto = productosAPI.find(
      (producto) => producto.codigo === selectedOption.value
    );
    console.log(selectedProducto);
    if (selectedProducto) {
      newProductos[index].codigo = selectedProducto.codigo;
      newProductos[index].descripcion = selectedProducto.descripcion;
      newProductos[index].precioVenta = selectedProducto.precioVenta;
    } else {
      newProductos[index].codigo = selectedOption.value;
      newProductos[index].descripcion = "";
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
    producto.total = (
      (producto.precioVenta -
        producto.precioVenta * (producto.descuento / 100)) *
      producto.cantidad
    ).toFixed(2);

    return (
      (producto.precioVenta -
        producto.precioVenta * (producto.descuento / 100)) *
      producto.cantidad
    );
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
    const productosValidos = productos.every(
      (producto) =>
        producto.codigo && producto.descripcion && producto.cantidad > 0
    );
    if (!productosValidos) {
      alert(
        "Por favor complete todos los datos de los productos antes de agregar otro."
      );
      return;
    }
    const newProductos = productos.map((producto) => ({
      ...producto,
      removable: true,
    }));
    setProductos([
      ...newProductos,
      {
        codigo: "",
        descripcion: "",
        cantidad: 1,
        precioVenta: 0,
        descuento: 0,
        total: 0,
        removable: true,
      },
    ]);
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
    const facturaVentaDetalles = productos
      .map((producto) => ({
        idProducto: productosAPI.find((p) => p.codigo === producto.codigo)?.id,
        cantidad: producto.cantidad,
        descuento: producto.descuento,
        total: producto.total,
      }))
      .filter((detalle) => detalle.idProducto && detalle.cantidad);

      const {
        descuentoGeneral,
        descuentoEspecial,
        tipoFactura,
        gravado,
        exento,
        iva,
        total,
      } = factura;
      
      // Asegurarse de que tipoFactura sea un número
      const tipoFacturaNumero = Number(tipoFactura);
      
      // Lógica para cambiar el valor de tipoFactura
      let tipoFacturaModificado;
      
      if (tipoFacturaNumero === 1) {
        tipoFacturaModificado = 'A';
      } else if (tipoFacturaNumero === 2) {
        tipoFacturaModificado = 'N';
      } else if (tipoFacturaNumero === 3) {
        tipoFacturaModificado = '50 50';
      }

      console.log(tipoFacturaModificado)
      
      const pedido = {
        idVendedor: 1,
        idCliente: selectedClienteId,
        descuentoGeneral,
        descuentoEspecial,
        tipoFactura: tipoFacturaModificado, // Se usa el valor modificado
        gravado,
        exento,
        iva,
        total,
        facturaVentaDetalles,
      };
      
      console.log("pedido", JSON.stringify(pedido));
    try {
      const response = await fetch(
        "http://vps-1915951-x.dattaweb.com:8090/api/v1/facturaventa",
        {
          method: "POST",
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


  const handleDescuentoGeneralChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setDescuentoGeneral(value);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/facturas");
  };

  // Opciones para react-select (mapeamos productosAPI a { value, label })
  const productOptionsCod = productosAPI.map((producto) => ({
    value: producto.codigo,
    label: `${producto.codigo} `,
  }));

  const productOptionsDes = productosAPI.map((producto) => ({
    value: producto.codigo,
    label: `${producto.descripcion}`,
  }));

  const clienteOptions = clientes.map((cliente) => ({
    value: cliente.id,
    label: cliente.razonSocial,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;


    setFactura((prevFactura) => ({
      ...prevFactura,
      [name]: value,
    }));

    if (name === "tipoFactura") {
      calcularTotales(); 
    }
  };


  const calcularTotales = () => {
    // Suma del total sin descuento
    const gravadoSinDescuento = productos.reduce(
      (acc, producto) =>
        acc + (producto.total ? parseFloat(producto.total) : 0),
      0
    ) || 0;
  
    // Aplicar descuento general al gravado
    const descuento = (gravadoSinDescuento * (descuentoGeneral / 100));
    let gravadoConDescuento = gravadoSinDescuento - descuento;
  
    let exento = 0;
    let iva = 0;
    let total = 0;
  
    // Aplica la lógica según el tipo de factura
    switch (factura.tipoFactura) {
      case "1": // Factura A (aplicar IVA completo al gravado con descuento)
        iva = gravadoConDescuento * 0.21;
        total = gravadoConDescuento + iva;
        break;
      case "2": // Factura N (sin IVA, solo gravado con descuento)
        iva = 0;
        total = gravadoConDescuento;
        break;
      case "3": // Factura 50 y 50 (50% del gravado con descuento y luego aplicar IVA)
        gravadoConDescuento = gravadoConDescuento / 2; // Aplica 50% adicional
        iva = gravadoConDescuento * 0.21;
        total = gravadoConDescuento + iva;
        break;
      default:
        break;
    }
  
    // Actualizar el estado de la factura con los nuevos valores calculados
    setFactura((prevFactura) => ({
      ...prevFactura,
      gravado: gravadoConDescuento.toFixed(2),
      exento: exento.toFixed(2),
      iva: iva.toFixed(2),
      total: total.toFixed(2),
    }));
  };
  

  useEffect(() => {
    calcularTotales();
  }, [descuentoGeneral, productos, factura.tipoFactura]);
  

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <br />
      <div className="container-principal">
        <h1>{isEditing ? " Convertir pedido a Factura" : "Crear Nueva Factura"}</h1>
        <button className="btn btn-secondary mb-3" onClick={handleBack}>
          Volver Atrás
        </button>
        <br />
        {validationError && (
          <div className="alert alert-danger">{validationError}</div>
        )}


      {selectedCliente && (
         <ClientDetails selectedCliente={selectedCliente} clienteDetails={clienteDetails} />
       )}

        <div className="input-row">
          <div className="input-row">
            <div className="input-container-descuento">
              <label htmlFor="descuento-general">Descuento General (%)</label>
              <input
                type="number"
                id="descuento-general"
                value={descuentoGeneral}
                onChange={handleDescuentoGeneralChange}
                className="form-select"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-container-descuento">
              <label htmlFor="tipoFactura">Tipo de Factura</label>
              <select
                id="tipoFactura"
                name="tipoFactura"
                className="form-select"
                value={factura.tipoFactura}
                onChange={handleChange}
              >
                <option value="1">A</option>
                <option value="2">N</option>
                <option value="3">50 y 50 </option>
              </select>
            </div>
          </div>
        </div>

        <hr />

        {/* Mapeo de productos con react-select */}
        {productos.map((producto, index) => (
        // <div className="container-box">
          <div className="input-row" key={index}>
            <div className="container-box">
            <div className="input-container small">
              <label htmlFor={`codigo-${index}`}>Código </label>
              <Select
                className="fixed-select"
                options={productOptionsCod}
                value={productOptionsCod.find(
                  (option) => option.value === producto.codigo
                )}
                onChange={(selectedOption) =>
                  handleCodigoChange(index, selectedOption)
                }
                placeholder="Seleccione un código"
                isDisabled={!selectedClienteId}
              />
               </div> 
            </div>
            {/* </div> */}

            <div className="input-container large">
              <label htmlFor={`descripcion-${index}`} className="description">Descripción </label>
              <Select
                className="fixed-select"
                options={productOptionsDes}
                value={productOptionsDes.find(
                  (option) => option.value === producto.codigo
                )}
                onChange={(selectedOption) =>
                  handleCodigoChange(index, selectedOption)
                }
                placeholder="Seleccione una descripción"
                isDisabled={!selectedClienteId}
              />
            </div>

            <div className="input-container xsmall">
              <label htmlFor={`cantidad-${index}`}>Cantidad </label>
              <input
                className="camps-tama-cant"
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
                className="camps-tama"
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
              />
            </div>

            <div className="input-container ">
              <label htmlFor={`precioTotal-${index}`}>Precio Total:</label>
              <input
                type="number"
                id={`precioTotal-${index}`}
                value={
                  calcularPrecioTotal(index) === null
                    ? "Completar cantidad por favor"
                    : calcularPrecioTotal(index).toFixed(2)
                }
                readOnly
                disabled={!selectedClienteId} // Deshabilitar si no hay cliente seleccionado
                className="price-total-productos"
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

        {/* Cálculos adicionales para factura */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="p-3 bg-light rounded shadow-sm">
              <strong>Gravado:</strong> ${factura.gravado}
            </div>
          </div>
          {factura.tipoFactura == 1 || factura.tipoFactura == 3 ? (
            <div className="col-md-3">
              <div className="p-3 bg-light rounded shadow-sm">
                <strong>IVA (21%):</strong> ${factura.iva}
              </div>
            </div>
          ) : null}
          <div className="col-md-3">
            <div className="p-3 bg-light rounded shadow-sm">
              <strong>Exento:</strong> ${factura.exento}
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-light rounded shadow-sm">
              <strong>Total:</strong> ${factura.total}
            </div>
          </div>
          <br />
          {/* <div className="calculo-item">
      <label>TOTAL:</label>
      <span>${factura.total}</span>
    </div> */}
        </div>

        <div className="bottom-controls">
          <div className="button-container">
            <button onClick={handleConfirmarVenta} className="confirm-button">
              {isEditing ? "Actualizar Pedido" : "Crear Factura"}
            </button>
          </div>
        </div>

        {/* Modal de confirmación */}
        {showModal && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Pedido Confirmado</h5>
                </div>
                <div className="modal-body">
                  <p>La factura se ha creado con éxito.</p>
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

        {/* Modal de confirmación de guardado */}
        {showConfirmModal && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar Guardado</h5>
                </div>
                <div className="modal-body">
                  <p>¿Está seguro de que desea crear la factura?</p>
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
    </div>
  );
};

export default Conversor;
