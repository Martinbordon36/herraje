import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import './FacturaScreen.css';
import search from '../../assets/lupa.png';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const FacturaScreen = () => {
  const [facturas, setFacturas] = useState([]); // Inicializamos como array vacío
  const [filteredFacturas, setFilteredFacturas] = useState([]); // También inicializamos como array vacío
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacturas = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }
      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/facturaventa`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener las facturas');
        }
        const data = await response.json();
        setFacturas(data || []); // Asegúrate de que 'data' es un array
        setFilteredFacturas(data || []); // Inicializa 'filteredFacturas' con un array
        // setTotalPages(data.totalPages); // Si usas paginación en el servidor
      } catch (error) {
        console.error('Error fetching facturas:', error);
      }
    };

    fetchFacturas();
  }, [token, currentPage]);

  const handleCreateFactura = () => {
    navigate('/crearFactura');
  };

  const handleEdit = (id) => {
    navigate(`/editarfactura/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/facturaventa/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al eliminar la factura');
      }
      setFacturas(facturas.filter(factura => factura.id !== id));
      setFilteredFacturas(filteredFacturas.filter(factura => factura.id !== id)); // Actualizar facturas filtradas
    } catch (error) {
      console.error('Error deleting factura:', error);
    }
  };

  const handleViewFactura = (id) => {
    navigate(`/verFactura/${id}`);
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
    setFilteredFacturas(
      facturas.filter((factura) =>
        factura.id.toString().includes(searchTerm) || 
        factura.cliente.toString().includes(searchTerm)
      )
    );
  };

  return (
    <>
      <Navbar />
      <br/>
      <div className="container">
        <h1 className="title">Facturas</h1>
        <button className="button" onClick={handleCreateFactura}>Crear Factura</button>
      <div className='container-search'>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por ID de factura o ID de cliente"
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
              <th className="th">#ID de Factura</th>
              <th className="th">Fecha</th>
              <th className="th">Tipo de Factura</th>
              <th className="th">ID Cliente</th>
              <th className="th">Total</th>
              <th className="th">Estado</th>
              <th className="th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredFacturas.length > 0 ? (
              filteredFacturas.map((factura) => (
                <tr key={factura.id}>
                  <td className="td">{factura.id}</td>
                  <td className="td">{new Date(factura.fecha).toLocaleString()}</td>
                  <td className="td">{factura.tipoFactura}</td>
                  <td className="td">{factura.cliente}</td>
                  <td className="td">{factura.total}</td>
                  <td className="td">{factura.estado}</td>
                  <td className="td">
                    <FaEye 
                      className="icon view-icon" 
                      onClick={() => handleViewFactura(factura.id)}
                    />
                    {/* <FaEdit 
                      className="icon edit-icon" 
                      onClick={() => handleEdit(factura.id)} 
                    /> */}
                    <FaTrash 
                      className="icon delete-icon" 
                      onClick={() => handleDelete(factura.id)} 
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="td">No se encontraron facturas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>

      <div className="pagination-info">
        <span className='numpag'>Página {currentPage } de {totalPages}</span>
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

export default FacturaScreen;
