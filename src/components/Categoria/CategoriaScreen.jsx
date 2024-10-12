import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import '../Producto/ProductoScreen.css';
import search from '../../assets/lupa.png';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import {
  Button,
  Card,
  Container,
  Form,
  Pagination,
  Table,
  InputGroup,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoriaScreen = () => {
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [categoria, setCategoria] = useState('');
  const [ultimaCategoria, setUltimaCategoria] = useState(null);
  const [showSubcategoriaModal, setShowSubcategoriaModal] = useState(false);
  const [showEditCategoriaModal, setShowEditCategoriaModal] = useState(false);
  const [subcategoria, setSubcategoria] = useState({
    idCategoria: '',
    descripcion: ''
  });
  const [editCategoria, setEditCategoria] = useState({
    id: '',
    descripcion: ''
  });
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch(
          `http://vps-1915951-x.dattaweb.com:8090/api/v1/categoria/paginacion?page=${currentPage}&size=5`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data = await response.json();
        setCategorias(data.content);
        setFilteredCategorias(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };

    fetchCategorias();
  }, [token, currentPage]);

  const handleCreateCategoria = () => {
    setShowCategoriaModal(true);
  };

  const handleCreateSubcategoria = () => {
    setShowSubcategoriaModal(true);
  };

  const handleEdit = (id) => {
    const categoriaToEdit = categorias.find((cat) => cat.id === id);
    setEditCategoria(categoriaToEdit);
    setShowEditCategoriaModal(true);
  };

  const handleCategoriaSubmit = (e) => {
    e.preventDefault();
    if (!categoria.trim()) {
      alert('La descripción de la categoría no puede estar vacía');
      return;
    }
    fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/categoria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ descripcion: categoria })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al crear la categoría');
        }
        return response.json();
      })
      .then(data => {
        setCategorias([...categorias, data]);
        setUltimaCategoria(data);
        setSubcategoria({ ...subcategoria, idCategoria: data.id });
        setCategoria('');
        setShowCategoriaModal(false);
        toast.success('Categoría creada exitosamente');
      })
      .catch(error => console.error('Error:', error));
  };

  const handleEditCategoriaSubmit = (e) => {
    e.preventDefault();
    if (!editCategoria.descripcion.trim()) {
      alert('La descripción de la categoría no puede estar vacía');
      return;
    }
    fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/categoria/${editCategoria.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ descripcion: editCategoria.descripcion })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al editar la categoría');
        }
        return response.json();
      })
      .then((data) => {
        setCategorias(categorias.map(cat => cat.id === data.id ? data : cat));
        setEditCategoria({ id: '', descripcion: '' });
        setShowEditCategoriaModal(false);
        toast.success('Categoría editada exitosamente');
      })
      .catch(error => console.error('Error:', error));
  };

  const handleSubcategoriaSubmit = (e) => {
    e.preventDefault();
    if (!subcategoria.descripcion.trim() || !subcategoria.idCategoria) {
      alert('La subcategoría debe tener una descripción y una categoría seleccionada');
      return;
    }
    fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/subcategoria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subcategoria)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al crear la subcategoría');
        }
        return response.json();
      })
      .then(data => {
        setSubcategoria({
          idCategoria: '',
          descripcion: ''
        });
        setShowSubcategoriaModal(false);
        toast.success('Subcategoría creada exitosamente');
      })
      .catch(error => console.error('Error:', error));
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://vps-1915951-x.dattaweb.com:8090/api/v1/categoria/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Error al eliminar la categoría');
      }
      setCategorias(categorias.filter((categoria) => categoria.id !== id));
      setFilteredCategorias(filteredCategorias.filter((categoria) => categoria.id !== id));
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      toast.success('Categoría eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting categoria:', error);
    }
  };

  const handleViewSubcategoria = (id) => {
    navigate(`/subcategoria/${id}`);
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
    setFilteredCategorias(
      categorias.filter((categoria) =>
        categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const confirmDelete = (id) => {
    setCategoriaToDelete(id);
    setShowConfirmModal(true);
  };

  const handleClose = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(false);
    setCategoriaToDelete(null);
  };

  const handleConfirmDelete = () => {
    handleDelete(categoriaToDelete);
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <Container className="my-5">
        <Card className="p-5 shadow-lg border-0 rounded-lg">
          <h2 className="mb-4 text-center text-primary">Categorías</h2>
          <Button variant="primary" className="mb-4 fw-bold" onClick={handleCreateCategoria}>
            + Crear Categoría
          </Button>
          <Button variant="secondary" className="mb-4 fw-bold ms-3" onClick={handleCreateSubcategoria}>
            + Crear Subcategoría
          </Button>

          <InputGroup className="mb-4 align-items-center" style={{ marginTop: '10px' }}><Form.Control
              type="text"
              placeholder="Buscar categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="shadow-sm mt5"
            />
            <Button variant="outline-primary" onClick={handleSearch} className="shadow-sm p-2"><img src={search} alt="Buscar" style={{ width: '18px' }} />
            </Button>
          </InputGroup>
          <Table responsive bordered hover className="shadow-sm rounded-lg">
          <thead style={{ backgroundColor: 'black', color: 'white' }} className="text-white">
          <tr>
                <th>#ID de Categoría</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategorias.map((categoria) => (
                <tr key={categoria.id} className="align-middle">
                  <td>{categoria.id}</td>
                  <td>{categoria.descripcion}</td>
                  <td>
                    <Button
                      variant="outline-info"
                      className="me-2 shadow-sm rounded-circle"
                      onClick={() => handleViewSubcategoria(categoria.id)}
                    >
                      <FaEye />
                    </Button>
                    <Button
                      variant="outline-warning"
                      className="me-2 shadow-sm rounded-circle"
                      onClick={() => handleEdit(categoria.id)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="shadow-sm rounded-circle"
                      onClick={() => confirmDelete(categoria.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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

      {/* Confirm Deletion Modal */}
      {showConfirmModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Eliminación</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar esta categoría?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Categoría Eliminada</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <p>La categoría ha sido eliminada exitosamente.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleClose}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Categoria Modal */}
      {showCategoriaModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Categoría</h5>
                <button type="button" className="btn-close" onClick={() => setShowCategoriaModal(false)}></button>
              </div>
              <div className="modal-body">
                <Form onSubmit={handleCategoriaSubmit}>
                  <div className="form-group">
                    <label>Descripción de la Categoría</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ingrese una descripción..."
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCategoriaModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Guardar Categoría</button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Subcategoria Modal */}
      {showSubcategoriaModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Subcategoría</h5>
                <button type="button" className="btn-close" onClick={() => setShowSubcategoriaModal(false)}></button>
              </div>
              <div className="modal-body">
                <Form onSubmit={handleSubcategoriaSubmit}>
                  <div className="form-group">
                    <label>Categoría</label>
                    <select
                      className="form-control"
                      value={subcategoria.idCategoria}
                      name="idCategoria"
                      onChange={(e) => setSubcategoria({ ...subcategoria, idCategoria: e.target.value })}
                    >
                      <option value="">Seleccione una categoría</option>
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.descripcion}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mt-3">
                    <label>Descripción de la Subcategoría</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ingrese una descripción..."
                      name="descripcion"
                      value={subcategoria.descripcion}
                      onChange={(e) => setSubcategoria({ ...subcategoria, descripcion: e.target.value })}
                    />
                  </div>
                  <div className="modal-footer mt-3">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowSubcategoriaModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Guardar Subcategoría</button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Categoria Modal */}
      {showEditCategoriaModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Categoría</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditCategoriaModal(false)}></button>
              </div>
              <div className="modal-body">
                <Form onSubmit={handleEditCategoriaSubmit}>
                  <div className="form-group">
                    <label>Descripción de la Categoría</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ingrese una descripción..."
                      value={editCategoria.descripcion}
                      onChange={(e) => setEditCategoria({ ...editCategoria, descripcion: e.target.value })}
                    />
                  </div>
                  <div className="modal-footer mt-3">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditCategoriaModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoriaScreen;