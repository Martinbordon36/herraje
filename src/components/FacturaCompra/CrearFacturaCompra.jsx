import React, { useState, useEffect } from "react";
import Navbar from "../Others/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import "./CrearFacturaCompra.css";
import Footer from "../Others/Footer";
import ProveedorDetails from "./ProveedorDetails";
import { Container, Button, Form, Modal } from 'react-bootstrap';


const CrearFacturaCompra = () => {
  const [productos, setProductos] = useState([
    {
      codigo: "",
      descripcion: "",
      cantidad: 0,
      precioCompra: 0,
      descuento: 0,
      total: 0,
      removable: true,
    },
  ]);

  const [productosAPI, setProductosAPI] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState("");
  const [selectedProveedorId, setSelectedProveedorId] = useState("");
  const [zona, setSelectZona] = useState("");

  const [proveedorDetails, setProveedorDetails] = useState({
    cuit: "",
    condicionIva: "",
    razonSocial: "",
    domicilio: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [descuentoGeneral, setDescuentoGeneral] = useState(0);
  const [factura, setFactura] = useState({
    descuentoGeneral: "0",
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
    if (selectedProveedorId) {
      const fetchProductosAPI = async () => {
        try {
          const response = await fetch(
            `http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/proveedor/${selectedProveedorId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
          const data = await response.json();
          setProductosAPI(data);
        } catch (error) {
          console.error("Error fetching productosAPI:", error);
        }
      };
      fetchProductosAPI();
    }
  }, [selectedProveedorId]);
  

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch(
          "http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener los proveedores");
        }
        const data = await response.json();
        setProveedores(data);
        setSelectedProveedorId(data[0]?.id); // Si quieres seleccionar el primer proveedor
      } catch (error) {
        console.error("Error fetching proveedores:", error);
      }
    };

    fetchProveedores();
  }, []);

  const handleProveedorSelect = (selectedOption) => {
    const proveedor = proveedores.find((p) => p.id === selectedOption.value);
    setSelectedProveedorId(proveedor.id);
    setSelectedProveedor(proveedor.razonSocial);
    setProveedorDetails({
      cuit: proveedor.cuit || "",
      condicionIva: proveedor.condicionIva || "",
      razonSocial: proveedor.razonSocial || "",
      domicilio: proveedor.domicilio || "",
    });
  };

  const handleCodigoChange = (index, selectedOption) => {
    const newProductos = [...productos];
    const selectedProducto = productosAPI.find(
      (producto) => producto.codigo === selectedOption.value
    );
    if (selectedProducto) {
      newProductos[index].codigo = selectedProducto.codigo;
      newProductos[index].descripcion = selectedProducto.descripcion;
      newProductos[index].precioCompra = selectedProducto.precioCompra;
    } else {
      newProductos[index].codigo = selectedOption.value;
      newProductos[index].descripcion = "";
      newProductos[index].precioCompra = 0;
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
      (producto.precioCompra -
        producto.precioCompra * (producto.descuento / 100)) *
      producto.cantidad
    ).toFixed(2);

    return (
      (producto.precioCompra -
        producto.precioCompra * (producto.descuento / 100)) *
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
        precioCompra: 0,
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

  const handleDescuentoGeneralChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setDescuentoGeneral(value);
  };

  const calcularTotales = () => {
    const gravadoSinDescuento =
      productos.reduce(
        (acc, producto) =>
          acc + (producto.total ? parseFloat(producto.total) : 0),
        0
      ) || 0;

    const descuento = gravadoSinDescuento * (descuentoGeneral / 100);
    let gravadoConDescuento = gravadoSinDescuento - descuento;

    let exento = 0;
    let iva = 0;
    let total = 0;

    switch (factura.tipoFactura) {
      case "1":
        iva = gravadoConDescuento * 0.21;
        total = gravadoConDescuento + iva;
        break;
      case "2":
        iva = 0;
        total = gravadoConDescuento;
        break;
      case "3":
        gravadoConDescuento = gravadoConDescuento / 2;
        iva = gravadoConDescuento * 0.21;
        total = gravadoConDescuento + iva;
        break;
      default:
        break;
    }

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

  const confirmarGuardarPedido = async () => {
    const facturaCompraDetalles = productos
      .map((producto) => ({
        idProducto: productosAPI.find((p) => p.codigo === producto.codigo)?.id,
        cantidad: producto.cantidad,
        descuento: producto.descuento,
        total: producto.total,
      }))
      .filter((detalle) => detalle.idProducto && detalle.cantidad);

    const pedido = {
      idVendedor: 1,
      idProveedor: selectedProveedorId,
      descuentoGeneral,
      tipoFactura: factura.tipoFactura,
      gravado: factura.gravado,
      exento: factura.exento,
      iva: factura.iva,
      total: factura.total,
      facturaCompraDetalles,
    };

    try {
      const response = await fetch(
        "http://vps-1915951-x.dattaweb.com:8090/api/v1/facturacompra",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pedido),
        }
      );
      if (!response.ok) {
        throw new Error("Error al confirmar la compra");
      }
      console.log(pedido);

      setShowConfirmModal(false);
      setShowModal(true);
    } catch (error) {
      console.error("Error confirming compra:", error);
    }
  };

  const proveedorOptions = proveedores.map((proveedor) => ({
    value: proveedor.id,
    label: proveedor.razonSocial,
  }));
  return (
    <div>
      <Navbar />
      <br />
      <br />
      <br />
      <div className="container-principal">
        <h1>
          {isEditing
            ? "Editar Pedido de Compra"
            : "Crear Nueva Factura de Compra"}
        </h1>
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          Volver Atrás
        </button>
        <br />
        {validationError && (
          <div className="alert alert-danger">{validationError}</div>
        )}

        {/* Información del proveedor o búsqueda */}
        {id ? (
          <h1>Proveedor: {selectedProveedor}</h1>
        ) : (
          <Select
            options={proveedorOptions}
            onChange={handleProveedorSelect}
            placeholder="Buscar proveedor"
          />
        )}


{selectedProveedor && (
         <ProveedorDetails selectedProveedor={selectedProveedor} proveedorDetails={proveedorDetails} />
)}

        {/* Campo de descuento general y tipo de factura */}
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

          <div className="input-container-descuento">
            <label htmlFor="tipoFactura">Tipo de Factura</label>
            <select
              id="tipoFactura"
              name="tipoFactura"
              className="form-select"
              value={factura.tipoFactura}
              onChange={(e) =>
                setFactura({ ...factura, tipoFactura: e.target.value })
              }
            >
              <option value="1">A</option>
              <option value="2">N</option>
              <option value="3">50 y 50</option>
            </select>
          </div>
        </div>

        <hr />

        {/* Mapeo de productos con react-select */}
        {productos.map((producto, index) => (
          <div className="input-row" key={index}>
            <div className="input-container small">
              <label htmlFor={`codigo-${index}`}>Código</label>
              <Select
                className="fixed-select"
                options={productosAPI.map((prod) => ({
                  value: prod.codigo,
                  label: prod.codigo,
                }))}
                value={productosAPI
                  .map((prod) => ({
                    value: prod.codigo,
                    label: prod.codigo,
                  }))
                  .find((option) => option.value === producto.codigo)}
                onChange={(selectedOption) =>
                  handleCodigoChange(index, selectedOption)
                }
                placeholder="Seleccione un código"
                isDisabled={!selectedProveedor}
              />
            </div>

            <div className="input-container large">
              <label htmlFor={`descripcion-${index}`}>Descripción</label>
              <Select
                className="fixed-select"
                options={productosAPI.map((prod) => ({
                  value: prod.codigo,
                  label: prod.descripcion,
                }))}
                value={productosAPI
                  .map((prod) => ({
                    value: prod.codigo,
                    label: prod.descripcion,
                  }))
                  .find((option) => option.value === producto.codigo)}
                onChange={(selectedOption) =>
                  handleCodigoChange(index, selectedOption)
                }
                placeholder="Seleccione una descripción"
                isDisabled={!selectedProveedor}
              />
            </div>

            <div className="input-container xsmall">
              <label htmlFor={`cantidad-${index}`}>Cantidad</label>
              <input
                className="camps-tama-cant"
                type="number"
                id={`cantidad-${index}`}
                name="cantidad"
                value={producto.cantidad}
                onChange={(e) => handleInputChange(index, e)}
                min={1}
                disabled={!selectedProveedorId}
              />
            </div>

            <div className="input-container xsmall">
              <label htmlFor={`precio-${index}`}>Precio</label>
              <input
                className="camps-tama"
                type="number"
                id={`precio-${index}`}
                name="precioCompra" // asegúrate de que sea 'precioCompra'
                value={producto.precioCompra}
                onChange={(e) => handleInputChange(index, e)} // permitir edición
                disabled={!selectedProveedorId} // deshabilitar si no hay proveedor seleccionado
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
                disabled={!selectedProveedorId}
                min={0}
                max={100}
              />
            </div>

            <div className="input-container">
              <label htmlFor={`precioTotal-${index}`}>Precio Total</label>
              <input
                type="number"
                id={`precioTotal-${index}`}
                value={
                  calcularPrecioTotal(index) === null
                    ? "Completar cantidad"
                    : calcularPrecioTotal(index).toFixed(2)
                }
                readOnly
                disabled={!selectedProveedorId}
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
        </div>

        <div className="bottom-controls">
          <div className="button-container">
            <button onClick={confirmarGuardarPedido} className="confirm-button">
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
                    onClick={() => {
                      setShowModal(false);
                      navigate("/FacturasCompra");
                    }}
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

export default CrearFacturaCompra;
