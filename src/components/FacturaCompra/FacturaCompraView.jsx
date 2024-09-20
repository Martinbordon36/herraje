import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FacturaCompraView.css";
import Navbar from "../Others/Navbar";
import logo from "../../assets/herrajelogo.jpeg";

const FacturaCompraView = () => {
  const { id } = useParams();
  const [factura, setFactura] = useState(null);
  const [proveedor, setProveedor] = useState(null); // Cambiado a proveedor
  const [idProveedor, setIdProveedor] = useState(null); // Cambiado a idProveedor

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFactura = async () => {
      if (!token) {
        console.error("Token no disponible");
        return;
      }

      try {
        const response = await fetch(
          `http://vps-1915951-x.dattaweb.com:8090/api/v1/facturacompra/${id}`, // Cambiado a facturacompra
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener la factura");
        }
        const data = await response.json();
        setFactura(data);
        setIdProveedor(data.proveedor); // Cambiado a idProveedor
      } catch (error) {
        console.error("Error fetching factura:", error);
      }
    };

    fetchFactura();
  }, [id, token]);

  useEffect(() => {
    const fetchProveedor = async () => {
      if (!token || !idProveedor) {
        return; // Asegurarse de que idProveedor esté disponible
      }

      try {
        const response = await fetch(
          `http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor/${idProveedor}`, // Cambiado a proveedor
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener el proveedor");
        }
        const data = await response.json();
        setProveedor(data); // Ahora se establece el proveedor
      } catch (error) {
        console.error("Error fetching proveedor:", error);
      }
    };

    fetchProveedor();
  }, [idProveedor, token]); // Añadí idProveedor como dependencia

  return (
    <>
      <br />
      <br />
      <Navbar />
      <br />
      <br />

      <div className="factura-container">
        <header className="factura-header">
          <div className="factura-logo">
            <img src={logo} alt="Logo" />
            <p>
              <strong>Razón social:</strong> ALMADA JUAN CARLOS{" "}
            </p>
            <p>
              <strong>Domicilio Comercial:</strong> Gobernador Cárcano 45 (5168)
              <br /> - Valle Hermoso{" "}
            </p>
            <p></p>
            <p>
              <strong>Condición frente al IVA:</strong> IVA Responsable
              Inscripto{" "}
            </p>
          </div>
          <div className="factura-info">
            {factura?.tipoFactura === "1" ? (
              <h1>
                <strong>FACTURA A</strong>
              </h1>
            ) : (
              <h1>
                <strong>FACTURA N</strong>
              </h1>
            )}
            <p>N°: {factura?.numeroFactura}</p>
            <p>
              Fecha de emisión:{" "}
              {factura ? new Date(factura.fecha).toLocaleString() : ""}
            </p>
            <p>CUIT: 20-08640218-2</p>
            <p>Ingresos Brutos: 904-471884-1 CONV. MULT</p>
            <p>Inicio de actividades: 102013</p>
          </div>
        </header>

        <section>
          <div className="factura-client-info">
            <div className="factura-client-info-header">
              <div className="container1">
                <p>
                  <strong>CUIT:</strong> {proveedor?.cuit}{" "}
                </p>
                <p>
                  <strong>Condición frente al IVA:</strong> {proveedor?.ivtCodigo}{" "}
                </p>
                <p>
                  <strong>Condición de venta:</strong>{" "}
                </p>
              </div>
              <div className="container2">
                <p>
                  <strong>Razón social:</strong> {proveedor?.razonSocial}{" "}
                </p>
                <p>
                  <strong>Domicilio:</strong> {proveedor?.domicilio}{" "}
                </p>
                <p>
                  <strong>Vendedor: {factura?.vendedor}</strong>{" "}
                </p>
              </div>
            </div>
          </div>
        </section>
<section className="factura-table">
  <table>
    <thead>
      <tr>
        <th>Código</th>
        <th>Producto / Servicio</th>
        <th>Cantidad</th>
        <th>Precio Unit.</th>
        <th>% Dto.</th>
        <th>Subtotal</th>
      </tr>
    </thead>
    <tbody>
      {factura?.facturaCompraDetalles && factura.facturaCompraDetalles.length > 0 ? (
        factura.facturaCompraDetalles.map((detalle, index) => (
          <tr key={index}>
            <td>{detalle.producto.codigo}</td>
            <td>{detalle.producto.descripcion}</td>
            <td>{detalle.cantidad}</td>
            <td>{detalle.producto.precioCompra?.toFixed(2)}</td>
            <td>{detalle.descuento}</td>
            <td>{detalle.total?.toFixed(2)}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6">No hay detalles disponibles para esta factura.</td>
        </tr>
      )}
    </tbody>
  </table>
</section>


        <section className="factura-totales">
          <table className="totales-table">
            <thead>
              <tr>
                <th>Gravado</th>
                <th>IVA</th>
                <th>Exento</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{factura?.gravado?.toFixed(2) || "0.00"}</td>
                <td>{factura?.iva?.toFixed(2) || "0.00"}</td>
                <td>{factura?.exento?.toFixed(2) || "0.00"}</td>
                <td>{factura?.total?.toFixed(2) || "0.00"}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <footer className="factura-footer">
          <p>C.A.E.: {factura?.cae} Fecha Vto: </p>
        </footer>
      </div>

      <br />
      <br />
    </>
  );
};

export default FacturaCompraView;
