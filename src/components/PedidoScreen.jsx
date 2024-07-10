import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import './ProductoScreen.css'; // Asegúrate de importar tu archivo CSS
import { FaEdit, FaTrash } from 'react-icons/fa';
import Footer from './Footer';

const PedidoScreen = () => {
  const [pedidos, setPedidos] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Este es el token " + token);

    const fetchPedidos = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/pedido', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los pedidos');
        }
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error('Error fetching pedidos:', error);
      }
    };

    fetchPedidos();
  }, [token]);

  const handleCreatePedido = () => {
    navigate('/nuevopedido');
  };

  const handleEdit = (id) => {
    navigate(`/editarpedido/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/pedido/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el pedido');
      }
      setPedidos(pedidos.filter(pedido => pedido.id !== id));
    } catch (error) {
      console.error('Error deleting pedido:', error);
    }
  };

  const handleViewPedido = (id) => {
    navigate(`/verPedido/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">Pedidos</h1>
        <button className="button" onClick={handleCreatePedido}>Crear Pedido</button>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="th">#ID de pedido</th>
              <th className="th">Fecha</th>
              <th className="th">Fecha Actualización</th>
              <th className="th">ID Cliente</th>
              <th className="th">ID Usuario</th>
              <th className="th">Enviado</th>
              <th className="th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td className="td">{pedido.id}</td>
                <td className="td">{new Date(pedido.fecha).toLocaleString()}</td>
                <td className="td">{pedido.fechaActualizacion ? new Date(pedido.fechaActualizacion).toLocaleString() : 'N/A'}</td>
                <td className="td">{pedido.idCliente}</td>
                <td className="td">{pedido.idUsuario}</td>
                <td className="td">{pedido.enviado ? 'Sí' : 'No'}</td>
                <td className="td">
                  <FaEdit 
                    className="icon edit-icon" 
                    onClick={() => handleEdit(pedido.id)} 
                  />
                  <FaTrash 
                    className="icon delete-icon" 
                    onClick={() => handleDelete(pedido.id)} 
                  />
                  <button className='button-subcategoria' onClick={() => handleViewPedido(pedido.id)}>Ver Pedido</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <Footer/> */}
    </>
  );
};

export default PedidoScreen;
