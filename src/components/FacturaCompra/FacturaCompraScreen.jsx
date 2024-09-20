import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import './FacturaCompraScreen.css';
import search from '../../assets/lupa.png';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const FacturaCompraScreen = () => {
  const [facturas, setFacturas] = useState([]);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [proveedores, setProveedores] = useState({}); // Cambiado de clientes a proveedores
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
        // Cambiado a facturacompra
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/facturacompra`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener las facturas');
        }
        const data = await response.json();
        setFacturas(data || []);
        setFilteredFacturas(data || []);

        // Obtener los datos de los proveedores en lugar de clientes
        const proveedorPromises = data.map(factura =>
          fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor/${factura.proveedor}`)
            .then(res => res.json())
            .then(proveedorData => ({
              id: factura.proveedor,
              razonSocial: proveedorData.razonSocial,
            }))
        );

        const proveedoresData = await Promise.all(proveedorPromises);
        const proveedoresMap = {};
        proveedoresData.forEach(proveedor => {
          proveedoresMap[proveedor.id] = proveedor.razonSocial;
        });
        setProveedores(proveedoresMap);
      } catch (error) {
        console.error('Error fetching facturas:', error);
      }
    };

    fetchFacturas();
  }, [token, currentPage]);

  const handleCreateFactura = () => {
    navigate('/crearFacturaCompra');
  };

  const handleEdit = (id) => {
    navigate(`/editarfactura/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      // Cambiado a facturacompra
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/facturacompra/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al eliminar la factura');
      }
      setFacturas(facturas.filter(factura => factura.id !== id));
      setFilteredFacturas(filteredFacturas.filter(factura => factura.id !== id));
    } catch (error) {
      console.error('Error deleting factura:', error);
    }
  };

  const handleViewFactura = (id) => {
    navigate(`/verFacturaCompra/${id}`);
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
        factura.proveedor.toString().includes(searchTerm) || // Buscar por ID del proveedor
        proveedores[factura.proveedor]?.toLowerCase().includes(searchTerm.toLowerCase()) // Buscar por razón social del proveedor
      )
    );
  };

  return (
    <>
      <Navbar />
      <br/>
      <div className="container">
        <h1 className="title">Facturas Compras</h1>
        <button className="button" onClick={handleCreateFactura}>Crear Factura</button>
        <div className='container-search'>
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por ID de factura o ID de proveedor"
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
                <th className="th">Razón Social Proveedor</th> {/* Cambiado a proveedor */}
                <th className="th">Total</th>
                <th className="th">Estado</th>
                <th className="th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacturas.length > 0 ? (
                filteredFacturas.map((factura) => (
                  <tr key={factura.id}>
                    {factura.tipoFactura == 1 ? factura.tipoFactura = 'A' : null}
                    {factura.tipoFactura == 2 ? factura.tipoFactura = 'N' : null}

                    <td className="td">{factura.id}</td>
                    <td className="td">{new Date(factura.fecha).toLocaleString()}</td>
                    <td className="td">{factura.tipoFactura}</td>
                    <td className="td">{proveedores[factura.proveedor] || factura.proveedor}</td> {/* Cambiado a proveedores */}
                    <td className="td">{factura.total}</td>
                    <td className="td">{factura.estado}</td>
                    <td className="td">
                      <FaEye 
                        className="icon view-icon" 
                        onClick={() => handleViewFactura(factura.id)}
                      />
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

export default FacturaCompraScreen;
