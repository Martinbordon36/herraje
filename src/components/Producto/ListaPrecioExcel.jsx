import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { Container, Table, Button, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const ListaPrecioExcel = () => {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [zona, setZona] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
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
        setClientes(data || []);
      } catch (error) {
        console.error('Error fetching clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const fetchProductosByZona = async (zonaId) => {
    try {
      setLoading(true);
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
      setProductos(data || []);
    } catch (error) {
      console.error('Error fetching productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const clienteOptions = clientes.map((cliente) => ({
    value: cliente.id,
    label: cliente.razonSocial,
  }));

  const handleClienteSelect = (selectedOption) => {
    setSelectedCliente(selectedOption);
    const clienteSeleccionado = clientes.find((c) => c.id === selectedOption.value);
    if (clienteSeleccionado && clienteSeleccionado.zona) {
      setZona(clienteSeleccionado.zona.id);
      fetchProductosByZona(clienteSeleccionado.zona.id);
    }
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([]);
    if (selectedCliente) {
      XLSX.utils.sheet_add_aoa(ws, [[`Cliente: ${selectedCliente.label}`]], { origin: 'A1' });
      ws['A1'].s = { font: { bold: true } };
    }
    XLSX.utils.sheet_add_aoa(ws, [[]], { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(ws, [[]], { origin: 'A3' });
    XLSX.utils.sheet_add_aoa(ws, [['Código', 'Descripción', 'Precio Unitario']], { origin: 'A4' });
    const productosData = productos.map((producto) => [
      producto.codigo,
      producto.descripcion,
      producto.precioVenta.toFixed(2),
    ]);
    XLSX.utils.sheet_add_aoa(ws, productosData, { origin: 'A5' });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'productos.xlsx');
  };

  return (
    <>
      <Navbar />
      <Container className="my-5">
        <div className="p-5 shadow-lg border-0 rounded-lg">
          <h2 className="mb-4 text-center text-primary">Generar Lista de Precios</h2>

          <div className="mb-4">
            <label htmlFor="autosuggest-cliente" className="form-label fw-bold">
              Seleccionar Cliente
            </label>
            <Select
              id="autosuggest-cliente"
              options={clienteOptions || []}
              value={selectedCliente}
              onChange={handleClienteSelect}
              placeholder="Buscar cliente"
              className="shadow-sm"
            />
          </div>

          <div className="text-center mb-4">
            <Button
              variant="success"
              onClick={handleExportExcel}
              className="shadow-sm d-flex align-items-center justify-content-center"
              disabled={!selectedCliente}
            >
              <FaFileExcel className="me-2" /> Generar lista de precios en formato .XLS
            </Button>
          </div>

          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" role="status">
                <span className="sr-only">Cargando...</span>
              </Spinner>
            </div>
          ) : (
            <Table responsive bordered hover className="shadow-sm rounded-lg">
              <thead style={{ backgroundColor: 'black', color: 'white' }} className="text-white">
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Precio Unitario</th>
                </tr>
              </thead>
              <tbody>
                {productos.length > 0 ? (
                  productos.map((producto) => (
                    <tr key={producto.id} className="align-middle">
                      <td>{producto.codigo}</td>
                      <td>{producto.descripcion}</td>
                      <td>{producto.precioVenta.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No hay productos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>
      </Container>

      <br/>
      <br/>

      <br/>
      <br/>
      <br/>
      <br/>
      <br/>

    </>
  );
};

export default ListaPrecioExcel;