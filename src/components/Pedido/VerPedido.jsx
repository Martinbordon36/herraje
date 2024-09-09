import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VerPedido.css';
import Navbar from '../Others/Navbar';
import logo from '../../assets/herrajelogo.jpeg';

const VerPedido = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [idCliente, setIdCliente] = useState(null);
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedido = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/pedido/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener la factura');
        }
        const data = await response.json();
        console.log(JSON.stringify(data));
        setPedido(data);
        setIdCliente(data.idCliente); // Aquí se establece el idCliente con el valor correcto
      } catch (error) {
        console.error('Error fetching factura:', error);
      }
    };

    fetchPedido();
  }, [id, token]);

  useEffect(() => {
    const fetchCliente = async () => {
      if (!token || !idCliente) {
        return; // Asegurarse de que idCliente esté disponible
      }

      try {
        const response = await fetch(
          `http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/${idCliente}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener el cliente");
        }
        const data = await response.json();
        console.log("Esto hay en clientes" + JSON.stringify(data));
        setCliente(data); // Ahora se establece el cliente
      } catch (error) {
        console.error("Error fetching cliente:", error);
      }
    };
    fetchCliente();
  }, [idCliente, token]); // Cambié la dependencia a idCliente

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
       
          </div>
          <div className="factura-info">
             <h1> <strong>PEDIDO </strong></h1>
   
          </div>
        </header>

        <section>
          <div className="factura-client-info">
            <div className="factura-client-info-header">
              <div className="container1">
                <p>
                  <strong>CUIT:</strong> {cliente?.cuit}{" "}
                </p>
                <p>
                  <strong>Condición frente al IVA:</strong> {cliente?.ivtCodigo}{" "}
                </p>
                <p>
                  <strong>Condición de venta:</strong>{" "}
                </p>
              </div>
              <div className="container2">
                <p>
                  <strong>Razón social:</strong> {cliente?.razonSocial}{" "}
                </p>
                <p>
                  <strong>Domicilio:</strong> {cliente?.domicilio}{" "}
                </p>
                <p>
                  <strong>Vendedor: {pedido?.vendedor}</strong>{" "}
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
                <th>Articulo</th>
                <th>Cantidad</th>
                <th>Dto.%</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
  {pedido?.pedidoDetalles?.map(detalle => (
    <tr key={detalle.id}>
      <td className='cabecera'>{detalle.producto.codigo}</td>
      <td className='cabecera'>{detalle.producto.descripcion}</td>
      <td className='cabecera'>{detalle.cantidad}</td>
      <td className='cabecera'>{detalle.descuento}</td>
      <td className='cabecera'>{(detalle.total).toFixed(2)}</td>
    </tr>
  )) || (
    <tr>
      <td colSpan="5">No hay detalles de pedido disponibles.</td>
    </tr>
  )}
</tbody>
          </table>
        </section>

        
		
		<div className="button-container">
          <button onClick={() => navigate(-1)} className="confirm-button">Volver</button>
        </div>

       
      </div>

      <br/>
      <br/>
    </>
  );
};

export default VerPedido;
