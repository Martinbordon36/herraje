import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import './FacturaScreen.css';
import search from '../../assets/lupa.png';
import { FaTrash, FaEye } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const FacturaCliente = () => {

  const [facturas, setFacturas] = useState([]);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [clientes, setClientes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams();  // Obtener el ID del cliente desde la URL

  useEffect(() => {
    const fetchFacturas = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }
      try {
        // Obtienes todas las facturas
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

        // Filtras las facturas por cliente
        const facturasFiltradas = data.filter(factura => factura.cliente.toString() === id);

        // Obtiene la razón social de cada cliente usando el ID de cliente
        const clientePromises = facturasFiltradas.map(factura => 
          fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente/${factura.cliente}`)
            .then(res => res.json())
            .then(clienteData => ({
              id: factura.cliente,
              razonSocial: clienteData.razonSocial
            }))
        );

        const clientesData = await Promise.all(clientePromises);
        const clientesMap = {};
        clientesData.forEach(cliente => {
          clientesMap[cliente.id] = cliente.razonSocial;
        });

        setClientes(clientesMap);
        setFacturas(facturasFiltradas || []);
        setFilteredFacturas(facturasFiltradas || []);
        
      } catch (error) {
        console.error('Error fetching facturas:', error);
      }
    };

    fetchFacturas();
  }, [token, id]);

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
      setFilteredFacturas(filteredFacturas.filter(factura => factura.id !== id));
    } catch (error) {
      console.error('Error deleting factura:', error);
    }
  };

  const handleViewFactura = (id) => {
    navigate(`/verFactura/${id}`);
  };

  const handleSearch = () => {
    setFilteredFacturas(
      facturas.filter((factura) =>
        factura.id.toString().includes(searchTerm) || 
        factura.cliente.toString().includes(searchTerm) || // Buscar por ID del cliente
        clientes[factura.cliente]?.toLowerCase().includes(searchTerm.toLowerCase()) // Buscar por razón social del cliente
      )
    );
  };

  // Convertir tipoFactura en número y mapear el valor
  const mapTipoFactura = (tipo) => {
    const tipoNumerico = Number(tipo); // Convertimos el tipo a número
    switch(tipoNumerico) {
      case 1:
        return 'A';
      case 2:
        return 'N';
      default:
        return tipo; // Si no es 1 o 2, devolver el valor tal como está
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title"> Facturas de Cliente</h1>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="th">#ID de Factura</th>
              <th className="th">Fecha</th>
              <th className="th">Tipo de Factura</th>
              <th className="th">Razón Social Cliente</th>
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
                  <td className="td">{mapTipoFactura(factura.tipoFactura)}</td> {/* Se usa la función para mapear tipoFactura */}
                  <td className="td">{clientes[factura.cliente] || factura.cliente}</td>
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
        <span className='numpag'>Página {currentPage} de {totalPages}</span>
      </div>
    </>
  );
};

export default FacturaCliente;
