import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import './Categorias.css';
import Footer from '../Others/Footer';
import { Card, Container, Form, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Categorias = () => {
  const [categoria, setCategoria] = useState('');
  const [subcategoria, setSubcategoria] = useState({
    idCategoria: '',
    descripcion: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [showCategoriaForm, setShowCategoriaForm] = useState(true);
  const [ultimaCategoria, setUltimaCategoria] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/categoria', {
      headers: {}
    })
      .then(response => response.json())
      .then(data => setCategorias(data))
      .catch(error => console.error('Error al cargar las categorías:', error));
  }, [token]);

  const handleCategoriaChange = (e) => {
    setCategoria(e.target.value);
  };

  const handleSubcategoriaChange = (e) => {
    const { name, value } = e.target;
    setSubcategoria({ ...subcategoria, [name]: value });
  };

  const handleCategoriaSubmit = (e) => {
    e.preventDefault();
    if (!categoria.trim()) {
      setModalMessage('La descripción de la categoría no puede estar vacía');
      setShowModal(true);
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
        setShowCategoriaForm(false);
        setModalMessage('Categoría creada exitosamente');
        setShowModal(true);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleSubcategoriaSubmit = (e) => {
    e.preventDefault();
    if (!subcategoria.descripcion.trim() || !subcategoria.idCategoria) {
      setModalMessage('La subcategoría debe tener una descripción y una categoría seleccionada');
      setShowModal(true);
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
        setModalMessage('Subcategoría creada exitosamente');
        setShowModal(true);
      })
      .catch(error => console.error('Error:', error));
  };

  const closeModal = () => {
    setShowModal(false);
    if (modalMessage === 'Subcategoría creada exitosamente') {
      window.location.href = '/categorias';
    }
  };

  return (
    <>
      <Navbar />
      <Container className="mt-5">
        {showCategoriaForm ? (
          <Card className="p-4 shadow-sm border-0 rounded-lg">
            <Card.Header className="bg-primary text-white">
              <h2>Crear Categoría</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleCategoriaSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción de la Categoría</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese una descripción..."
                    value={categoria}
                    onChange={handleCategoriaChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 fw-bold">
                  Guardar Categoría
                </Button>
              </Form>
            </Card.Body>
          </Card>
        ) : (
          <Card className="p-4 shadow-sm border-0 rounded-lg mt-4">
            <Card.Header className="bg-primary text-white">
              <h2>Crear Subcategoría</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubcategoriaSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={subcategoria.idCategoria}
                    name="idCategoria"
                    onChange={handleSubcategoriaChange}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.descripcion}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción de la Subcategoría</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese una descripción..."
                    name="descripcion"
                    value={subcategoria.descripcion}
                    onChange={handleSubcategoriaChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 fw-bold">
                  Guardar Subcategoría
                </Button>
              </Form>
            </Card.Body>
          </Card>
        )}
      </Container>

      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"></h5>
                {/* <button type="button" className="close" onClick={closeModal}>
                  <span>&times;</span>
                </button> */}
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={closeModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default Categorias;