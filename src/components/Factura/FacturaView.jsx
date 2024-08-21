import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './FacturaView.css';
import Navbar from '../Others/Navbar';
import logo from '../../assets/herrajelogo.jpeg';

const FacturaView = () => {
  const { id } = useParams();
  const [factura, setFactura] = useState(null);
  const [cliente, setClientes] = useState([]);
  const [idCliente, setIdClientes] = useState([]);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFactura = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/facturaventa/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener la factura');
        }
        const data = await response.json();
        setFactura(data);
        console.log(JSON.stringify(data));
        setIdClientes(data.cliente)
         console.log(data);
 

      } catch (error) {
        console.error('Error fetching factura:', error);
      }
    };

    const fetchClientes = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }
      console.log(idCliente);

      try {
        const response = await fetch(
          `http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/${idCliente}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error('Error al obtener los clientes');
        }
        console.log(idCliente);
        const data = await response.json();
         setClientes(data);
        console.log("Esto hay en clientes " + JSON.stringify(cliente));
      } catch (error) {
        console.error('Error fetching clientes:', error);
      }
    };

    fetchFactura();
    fetchClientes();

  }, [id, token]);

  // if (!factura) {
  //   return <div>Cargando...</div>;
  // }

  

  return (
    <>

      <br/>
      <br/>
      <Navbar />
      <br/>
      <br/>
      
    <div className="factura-container">
      <header className="factura-header">
        <div className="factura-logo">
          <img src={logo} alt="Logo" />
          <p><strong>Razón social:</strong> ALMADA JUAN CARLOS </p>
          <p><strong>Domicilio Comercial:</strong> Gobernador Cárcano 45 (5168)<br/> - Valle Hermoso </p>
          <p></p>
          <p><strong>Condición frente al IVA: : IVA Responsable Inscripto</strong> </p>
        </div>
        <div className="factura-info">
          <h1> <strong>FACTURA A</strong></h1>
          <p>N°: : 00006 00006076 </p>
          {/* <p>Fecha de emisión: {new Date(factura.fecha).toLocaleString()}</p> */}
          <p>CUIT: 20-08640218-2</p>
          <p>Ingresos Brutos: 904-471884-1 CONV. MULT</p>
          <p>Inicio de actividades: 102013</p>

        </div>
      </header>

      <section >
        <div className="factura-client-info">
          <div className='factura-client-info-header'>
            <div className='container1'>
            <p><strong>CUIT:</strong> {cliente.cuit} </p>
            <p><strong>Condición frente al IVA:</strong> {cliente.ivtCodigo} </p>
            <p><strong>Condición de venta:</strong> </p>

            </div>
          <div className='container2'> 
          <p><strong>Razón social:</strong> {cliente.razonSocial} </p>
          <p><strong>Domicilio:</strong> {cliente.domicilio} </p>
          <p><strong>Vendedor:</strong>  </p>

          </div>

          </div>
        <div>

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
      {factura && factura.facturaVentaDetalles.map((detalle, index) => (
        <tr key={index}>
          <td>{detalle.producto.codigo}</td>
          <td>{detalle.producto.descripcion}</td>
          <td>{detalle.cantidad}</td>
          <td>{detalle.producto.precioVenta.toFixed(2)}</td>
          <td>{detalle.descuento}</td>
          <td>{(detalle.total).toFixed(2)}</td>
        </tr>
      ))}
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
        <td>{factura?.gravado ? factura.gravado.toFixed(2) : "0.00"}</td>
        <td>{factura?.iva ? factura.iva.toFixed(2) : "0.00"}</td>
        <td>{factura?.exento ? factura.exento.toFixed(2) : "0.00"}</td>
        <td>{factura?.total ? factura.total.toFixed(2) : "0.00"}</td>
      </tr>
    </tbody>
  </table>
</section>

      <footer className="factura-footer">
        <p>C.A.E.:  Fecha Vto: </p>
      </footer>

      </div>

      {/* <div className="container">
        <h1>Detalles de la Factura</h1>
        <p><strong>Cliente ID:</strong> {factura.cliente}</p>
        <p><strong>Fecha:</strong> {new Date(factura.fecha).toLocaleString()}</p>
        <p><strong>Tipo de Factura:</strong> {factura.tipoFactura}</p>
        <p><strong>Total:</strong> {factura.total.toFixed(2)}</p>
        <p><strong>Estado:</strong> {factura.estado}</p>
        
        <table className='vfactura'>
          <thead>
            <tr>
              <th className='cabecera'>Código</th>
              <th className='cabecera'>Artículo</th>
              <th className='cabecera'>Cant.</th>
              <th className='cabecera'>Dto %</th>
              <th className='cabecera'>Total</th>
            </tr>
          </thead>
          <tbody>
            {factura.facturaVentaDetalles.map(detalle => (
              <tr key={detalle.id}>
                <td className='cabecera'>{detalle.producto.codigo}</td>
                <td className='cabecera'>{detalle.producto.descripcion}</td>
                <td className='cabecera'>{detalle.cantidad}</td>
                <td className='cabecera'>{detalle.descuento}</td>
                <td className='cabecera'>{(detalle.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="button-container">
          <button onClick={() => navigate(-1)} className="confirm-button">Volver</button>
        </div>
      </div> */}
            <br/>
            <br/>
    </>
  );
};

export default FacturaView;
