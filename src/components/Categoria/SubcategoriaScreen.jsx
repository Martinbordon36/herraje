import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import '../Producto/ProductoScreen.css'; // Asegúrate de importar tu archivo CSS
import './SubCategoriaScreen.css';
import { Table, Button, Container, Spinner } from 'react-bootstrap';

const SubcategoriaScreen = () => {
  const [subcategorias, setSubcategorias] = useState([]);
  const [categoriaDescripcion, setCategoriaDescripcion] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubcategorias = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/categoria/${id}/subcategorias`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener las subcategorías');
        }
        const data = await response.json();
        setCategoriaDescripcion(data.descripcion);
        setSubcategorias(data.listaSubCategoria);
      } catch (error) {
        console.error('Error fetching subcategorias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategorias();
  }, [token, id]);

  const handleBack = () => {
    navigate(-1); // Navega a la página anterior
  };

  return (
    <>
      <Navbar />
      <br />
      <Container className="subcategoria-container mt-5">
        <h1 className="subcategoria-title">Subcategorías de {categoriaDescripcion}</h1>
        <Button variant="secondary" onClick={handleBack} className="button-back my-3">Volver</Button>
        {loading ? (
          <div className="spinner-container">
            <Spinner animation="border" role="status">
              <span className="sr-only">Cargando...</span>
            </Spinner>
          </div>
        ) : subcategorias.length > 0 ? (
          <div className="table-responsive">
            <Table bordered hover className="subcategoria-table modern-table">
              <thead>
                <tr>
                  <th style={{ color: 'black'}}>#ID de Subcategoría</th>
                  <th style={{ color: 'black'}}>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {subcategorias.map((subcategoria) => (
                  <tr key={subcategoria.idSubCategoria}>
                    <td>{subcategoria.idSubCategoria}</td>
                    <td>{subcategoria.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <p className="no-subcategorias">No se encontraron subcategorías.</p>
        )}
      </Container>
    </>
  );
};

export default SubcategoriaScreen;

