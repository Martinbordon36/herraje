import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';  // Importamos react-select
import './ProductoScreen.css';
import search from '../../assets/lupa.png';
import excel from '../../assets/excel.png';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import * as XLSX from 'xlsx'; // Importar la biblioteca xlsx

const ListaPrecioExcel = () => {
  const [productos, setProductos] = useState([]);  // Inicializamos como array vacío
  const [clientes, setClientes] = useState([]);  // Inicializamos como array vacío
  const [selectedCliente, setSelectedCliente] = useState(null); // Cliente seleccionado
  const [zona, setZona] = useState(null); // ID de la zona del cliente
  const [currentPage, setCurrentPage] = useState(0); // Paginación
  const [totalPages, setTotalPages] = useState(0); // Total de páginas
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch para obtener la lista de clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/cliente`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los clientes');
        }
        const data = await response.json();
        setClientes(data || []); // Aseguramos que sea un array
      } catch (error) {
        console.error('Error fetching clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  // Fetch para obtener los productos filtrados por zona sin paginación
  const fetchProductosByZona = async (zonaId) => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/cliente/${zonaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener los productos por zona');
      }
      const data = await response.json();
      setProductos(data || []); // Cargar productos sin paginación
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  // Opciones para el autosuggest de clientes
  const clienteOptions = clientes.map((cliente) => ({
    value: cliente.id,
    label: cliente.razonSocial,
  }));

  // Manejar la selección del cliente
  const handleClienteSelect = (selectedOption) => {
    setSelectedCliente(selectedOption);
    const clienteSeleccionado = clientes.find((c) => c.id === selectedOption.value);
    if (clienteSeleccionado && clienteSeleccionado.zona) {
      setZona(clienteSeleccionado.zona.id); // Establecemos la zona seleccionada
      fetchProductosByZona(clienteSeleccionado.zona.id); // Llamada a la API para llenar la tabla con productos de la zona
    }
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([]); // Inicializamos una hoja de cálculo vacía

    // Agregar la razón social del cliente en la primera fila con negritas
    if (selectedCliente) {
      XLSX.utils.sheet_add_aoa(ws, [[`Cliente: ${selectedCliente.label}`]], { origin: 'A1' });

      // Aplicamos el estilo en negrita a la celda de la razón social
      ws['A1'].s = { font: { bold: true } };
    }

    // Agregar dos filas de separación (filas vacías)
    XLSX.utils.sheet_add_aoa(ws, [[]], { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(ws, [[]], { origin: 'A3' });

    // Agregar encabezados de la tabla en la cuarta fila
    XLSX.utils.sheet_add_aoa(ws, [['Código', 'Descripción', 'Precio Unitario']], { origin: 'A4' });

    // Agregar los productos a partir de la quinta fila
    const productosData = productos.map((producto) => [producto.codigo, producto.descripcion, producto.costo]);
    XLSX.utils.sheet_add_aoa(ws, productosData, { origin: 'A5' });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'productos.xlsx');
  };

  return (
    <>
      <Navbar />
      <br />
      <div className="container">
        <h1 className="title">Generar Lista de Precios</h1>

        {/* Autosuggest para seleccionar cliente */}
        <div className="input-row">
          <label htmlFor="autosuggest-cliente">Seleccionar Cliente</label>
          <Select
            id="autosuggest-cliente"
            options={clienteOptions || []}  // Aseguramos que siempre sea un array
            value={selectedCliente}
            onChange={handleClienteSelect}
            placeholder="Buscar cliente"
          />
        </div>

        {/* Botón para exportar a Excel */}
        <div className="container-search">
          <a onClick={handleExportExcel}>
            <img src={excel} className="search-button" alt="Descargar" />
          </a>
        </div>

        {/* Tabla de productos */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="th">Código</th>
                <th className="th">Descripción</th>
                <th className="th">Precio Unitario</th>
              </tr>
            </thead>
            <tbody>
              {productos.length > 0 ? (
                productos.map((producto) => (
                  <tr key={producto.id}>
                    <td className="td">{producto.codigo}</td>
                    <td className="td">{producto.descripcion}</td>
                    <td className="td">{producto.precioVenta.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="td">No hay productos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ListaPrecioExcel;
