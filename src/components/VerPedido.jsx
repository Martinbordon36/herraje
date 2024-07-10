import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VerPedido.css';

const VerPedido = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
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
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener el pedido');
        }
        const data = await response.json();
        setPedido(data);
      } catch (error) {
        console.error('Error fetching pedido:', error);
      }
    };

    fetchPedido();
  }, [id, token]);

  if (!pedido) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <h1>Detalles del Pedido</h1>
      <p><strong>Cliente:</strong> {pedido.idCliente}</p>
      <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
      <table className='vpedido'>
        <thead>
          <tr>
            <th className='cabecera'>Código</th>
            <th className='cabecera'>Artículo</th>
            <th className='cabecera'>Cant.</th>
          </tr>
        </thead>
        <tbody>
          {pedido.pedidoDetalles.map(detalle => (
            <tr key={detalle.id}>
              <td className='cabecera'>{detalle.producto.codigo}</td>
              <td className='cabecera'>{detalle.producto.descripcion}</td>
              <td className='cabecera'>{detalle.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>


      <div className="button-container">
          <button onClick={() => navigate(-1)} className="confirm-button">Volver</button>
        </div>

    </div>
  );
};

export default VerPedido;
