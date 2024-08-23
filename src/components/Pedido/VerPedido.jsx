import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VerPedido.css';
import Navbar from '../Others/Navbar';
import logo from '../../assets/herrajelogo.jpeg';

const VerPedido = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [cliente, setCliente] = useState(null); // Cambié el nombre a singular porque estamos manejando un solo cliente
  const [idCliente, setIdCliente] = useState(null); // Cambié el nombre a singular
  
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
        setPedido(data);
       // setIdCliente(data.cliente); // Aquí se establece el idCliente
      } catch (error) {
        console.error('Error fetching factura:', error);
      }
    };

    fetchPedido();
  }, [id, token]);

 

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