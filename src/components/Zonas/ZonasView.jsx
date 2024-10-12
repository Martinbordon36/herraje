import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { Card, Container, Table, Pagination, Spinner, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import search from '../../assets/lupa.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ZonasView = () => {
  const [zonas, setZonas] = useState([]);
  const [filteredZonas, setFilteredZonas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newZona, setNewZona] = useState({ nombre: '' });

  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/zona/paginacion?page=${currentPage}&size=5`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener las zonas');
        }
        const data = await response.json();
        setZonas(data.content);
        setFilteredZonas(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching zonas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchZonas();
  }, [currentPage]);

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
    setFilteredZonas(
      zonas.filter((zona) =>
        zona.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleCreateZona = () => {
    setShowCreateModal(true);
  };

  const handleSaveNewZona = async () => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/zona`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newZona),
      });
      if (!response.ok) {
        throw new Error('Error al guardar la zona');
      }
      const createdZona = await response.json();
      setZonas([...zonas, createdZona]);
      setFilteredZonas([...filteredZonas, createdZona]);
      setShowCreateModal(false);
      setNewZona({ nombre: '' });
      toast.success('Zona creada exitosamente');
    } catch (error) {
      console.error('Error saving new zona:', error);
      toast.error('Error al guardar la zona');
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <Container className="my-5">
        <Card className="p-5 shadow-lg border-0 rounded-lg">
          <h2 className="mb-4 text-center text-primary">Listado de Zonas</h2>

          <Button variant="primary" className="mb-4 fw-bold" onClick={handleCreateZona}>
            + Crear Zona
          </Button>

          <InputGroup className="mb-4 align-items-center" style={{ marginTop: '10px' }}>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre de zona..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shadow-sm mt5"
            />
            <Button variant="outline-primary" onClick={handleSearch} className="shadow-sm p-2">
              <img src={search} alt="Buscar" style={{ width: '18px' }} />
            </Button>
          </InputGroup>

          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" role="status">
                <span className="sr-only">Cargando...</span>
              </Spinner>
            </div>
          ) : filteredZonas.length > 0 ? (
            <Table responsive bordered hover className="shadow-sm rounded-lg">
              <thead style={{ backgroundColor: 'black', color: 'white' }} className="text-white">
                <tr>
                  <th style={{ color: 'black' }}>ID de Zona</th>
                  <th style={{ color: 'black' }}>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {filteredZonas.map((zona) => (
                  <tr key={zona.id} className="align-middle">
                    <td>{zona.id}</td>
                    <td>{zona.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-muted">No se encontraron zonas.</p>
          )}

          <Pagination className="justify-content-center mt-4">
            <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 0} className="shadow-sm">
              Página Anterior
            </Pagination.Prev>
            <Pagination.Item active className="shadow-sm">
              {currentPage + 1}
            </Pagination.Item>
            <Pagination.Next onClick={handleNextPage} disabled={currentPage >= totalPages - 1} className="shadow-sm">
              Página Siguiente
            </Pagination.Next>
          </Pagination>
        </Card>
      </Container>

      {/* Modal de Creación */}
      {showCreateModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Zona</h5>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nombre de Zona</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newZona.nombre}
                    onChange={(e) => setNewZona({ ...newZona, nombre: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveNewZona}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <br />
    </>
  );
};

export default ZonasView;