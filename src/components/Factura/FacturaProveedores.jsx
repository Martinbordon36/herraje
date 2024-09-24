import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import './FacturaScreen.css'; // Puedes mantener el mismo estilo o crear uno para proveedores
import search from '../../assets/lupa.png';
import { FaTrash, FaEye } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const FacturaProveedores = () => {

  const [facturas, setFacturas] = useState([]);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [proveedores, setProveedores] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams();  // Obtener el ID del proveedor desde la URL

  useEffect(() => {
    const fetchFacturas = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }
      try {
        // Obtienes todas las facturas de proveedores
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/facturacompra`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener las facturas de proveedores');
        }
        const data = await response.json();

        // Filtras las facturas por proveedor
        const facturasFiltradas = data.filter(factura => factura.proveedor.toString() === id);

        // Obtiene la razón social de cada proveedor usando el ID de proveedor
        const proveedorPromises = facturasFiltradas.map(factura => 
          fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/proveedor/${factura.proveedor}`)
            .then(res => res.json())
            .then(proveedorData => ({
              id: factura.proveedor,
              razonSocial: proveedorData.razonSocial
            }))
        );

        const proveedoresData = await Promise.all(proveedorPromises);
        const proveedoresMap = {};
        proveedoresData.forEach(proveedor => {
          proveedoresMap[proveedor.id] = proveedor.razonSocial;
        });

        setProveedores(proveedoresMap);
        setFacturas(facturasFiltradas || []);
        setFilteredFacturas(facturasFiltradas || []);
        
      } catch (error) {
        console.error('Error fetching facturas:', error);
      }
    };

    fetchFacturas();
  }, [token, id]);

  const handleCreateFactura = () => {
    navigate('/crearFacturaProveedor'); // Cambia la ruta para crear una factura de proveedores
  };

  const handleEdit = (id) => {
    navigate(`/editarfacturaProveedor/${id}`); // Cambia la ruta para editar la factura de proveedores
  };

  const handleDelete = async (id) => {
    try {
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

  const handleSearch = () => {
    setFilteredFacturas(
      facturas.filter((factura) =>
        factura.id.toString().includes(searchTerm) || 
        factura.proveedor.toString().includes(searchTerm) || // Buscar por ID del proveedor
        proveedores[factura.proveedor]?.toLowerCase().includes(searchTerm.toLowerCase()) // Buscar por razón social del proveedor
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
      case 3:
        return '50 50'; // Si el tipo de factura es 3, devolver "50 50"
      default:
        return tipo; // Si no es 1, 2 o 3, devolver el valor tal como está
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title"> Facturas de Proveedores</h1>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="th">#ID de Factura</th>
              <th className="th">Fecha</th>
              <th className="th">Tipo de Factura</th>
              <th className="th">Razón Social Proveedor</th>
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
                  <td className="td">{proveedores[factura.proveedor] || factura.proveedor}</td>
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
                <td colSpan="7" className="td">No se encontraron facturas de proveedores.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>

    </>
  );
};

export default FacturaProveedores;
