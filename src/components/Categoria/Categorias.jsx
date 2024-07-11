import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import './Categorias.css'; // Asegúrate de crear y enlazar este archivo CSS
import Footer from '../Others/Footer';

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

  const token = localStorage.getItem('token'); // Obtener el token desde localStorage o donde lo tengas almacenado

  useEffect(() => {
    fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/categoria', {
      headers: {
      }
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
        console.log('Categoría creada:', data);
        setCategorias([...categorias, data]);
        setUltimaCategoria(data); // Guardar la última categoría creada
        setSubcategoria({ ...subcategoria, idCategoria: data.id }); // Establecer la última categoría como seleccionada
        setCategoria('');
        setShowCategoriaForm(false); // Ocultar el formulario de categoría y mostrar el de subcategoría
        setModalMessage('Categoría creada exitosamente');
        setShowModal(true);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleSubcategoriaSubmit = (e) => {
    e.preventDefault();
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
        console.log('Subcategoría creada:', data);
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
      window.location.href = '/categorias'; // Redirigir a la página de categorías
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        {showCategoriaForm ? (
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Crear Categoría</h1>
            </div>
            <div className="card-body">
              <form onSubmit={handleCategoriaSubmit}>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="categoria" className="form-label">Descripción de la Categoría</label>
                    <input
                      type="text"
                      id="categoria"
                      name="categoria"
                      className="form-control"
                      value={categoria}
                      onChange={handleCategoriaChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <button className="btn btn-primary w-100" type="submit">Guardar Categoría</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="card mt-4">
            <div className="card-header">
              <h1 className="card-title">Crear Subcategoría</h1>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubcategoriaSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="idCategoria" className="form-label">Categoría</label>
                    <select
                      id="idCategoria"
                      name="idCategoria"
                      className="form-control"
                      value={subcategoria.idCategoria}
                      onChange={handleSubcategoriaChange}
                    >
                      <option value="">Seleccione una categoría</option>
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.descripcion}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="descripcion" className="form-label">Descripción de la Subcategoría</label>
                    <input
                      type="text"
                      id="descripcion"
                      name="descripcion"
                      className="form-control"
                      value={subcategoria.descripcion}
                      onChange={handleSubcategoriaChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <button className="btn btn-primary w-100" type="submit">Guardar Subcategoría</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Éxito</h5>
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
