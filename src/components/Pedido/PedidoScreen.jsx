import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import '../Producto/ProductoScreen.css'; // Asegúrate de importar tu archivo CSS
import search from '../../assets/lupa.png';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const PedidoScreen = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [clientes, setClientes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/pedido/paginacion?page=${currentPage}&size=5`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los pedidos');
        }
        const data = await response.json();
        setPedidos(data.content);
        setFilteredPedidos(data.content); // Inicializar pedidos filtrados
        setTotalPages(data.totalPages);

        // Aquí obtienes los IDs de clientes y haces las solicitudes necesarias
        const clientePromises = data.content.map(pedido =>
          fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/${pedido.idCliente}`)
            .then(res => res.json())
            .then(clienteData => ({
              id: pedido.idCliente,
              razonSocial: clienteData.razonSocial,
            }))
        );

        const clientesData = await Promise.all(clientePromises);
        const clientesMap = {};
        clientesData.forEach(cliente => {
          clientesMap[cliente.id] = cliente.razonSocial;
        });
        setClientes(clientesMap);
      } catch (error) {
        console.error('Error fetching pedidos:', error);
      }
    };

    fetchPedidos();
  }, [token, currentPage]);

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
      setFilteredPedidos(filteredPedidos.filter(pedido => pedido.id !== id)); // Actualizar pedidos filtrados
    } catch (error) {
      console.error('Error deleting pedido:', error);
    }
  };

  const handleViewPedido = (id) => {
    navigate(`/verPedido/${id}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = () => {
    setFilteredPedidos(
      pedidos.filter((pedido) =>
        pedido.id.toString().includes(searchTerm) || clientes[pedido.idCliente]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">Pedidos</h1>
        <button className="button" onClick={handleCreatePedido}>Crear Pedido</button>

        <div className='container-search'>
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por ID de pedido o Razón Social de cliente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-client"
            />
            <a onClick={handleSearch}>
              <img src={search} className='search-button'/>
            </a>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="th">#ID de pedido</th>
                <th className="th">Fecha</th>
                <th className="th">Fecha Actualización</th>
                <th className="th">Razón Social Cliente</th>
                <th className="th">ID Usuario</th>
                <th className="th">Enviado</th>
                <th className="th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td className="td">{pedido.id}</td>
                  <td className="td">{new Date(pedido.fecha).toLocaleString()}</td>
                  <td className="td">{pedido.fechaActualizacion ? new Date(pedido.fechaActualizacion).toLocaleString() : 'N/A'}</td>
                  <td className="td">{clientes[pedido.idCliente] || pedido.idCliente}</td>
                  <td className="td">{pedido.idUsuario}</td>
                  <td className="td">{pedido.enviado ? 'Sí' : 'No'}</td>
                  <td className="td">
                    <FaEye 
                      className="icon view-icon" 
                      onClick={() => handleViewPedido(pedido.id)}
                    />
                    <FaEdit 
                      className="icon edit-icon" 
                      onClick={() => handleEdit(pedido.id)} 
                    />
                    <FaTrash 
                      className="icon delete-icon" 
                      onClick={() => handleDelete(pedido.id)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination-info">
        <span className='numpag'>Página {currentPage + 1} de {totalPages}</span>
      </div>

      <div className="pagination">
        <div className="pagination-buttons">
          <button className="button" id="bt" onClick={handlePreviousPage} disabled={currentPage === 0}>
            Página Anterior
          </button>
          <button className="button" id="bt" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Página Siguiente
          </button>
        </div>
      </div>
    </>
  );
};

export default PedidoScreen;
