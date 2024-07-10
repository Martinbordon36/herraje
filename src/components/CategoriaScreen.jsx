import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import './ProductoScreen.css'; // Asegúrate de importar tu archivo CSS
import { FaEdit, FaTrash } from 'react-icons/fa';

const CategoriaScreen = () => {
  const [categorias, setCategorias] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Este es el token " + token);

    const fetchCategorias = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/categoria', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };

    fetchCategorias();
  }, [token]);

  const handleCreateCategoria = () => {
    navigate('/nuevacategoria');
  };

  const handleEdit = (id) => {
    navigate(`/editarcategoria/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/categoria/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al eliminar la categoría');
      }
      setCategorias(categorias.filter(categoria => categoria.id !== id));
    } catch (error) {
      console.error('Error deleting categoria:', error);
    }
  };

  const handleViewSubcategoria = (id) => {
    navigate(`/subcategoria/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">Categorías</h1>
        <button className="button" onClick={handleCreateCategoria}>Crear Categoría</button>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="th">#ID de categoría</th>
                <th className="th">Descripción</th>
                <th className="th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td className="td">{categoria.id}</td>
                  <td className="td">{categoria.descripcion}</td>
                  <td className="td">
                    <FaEdit 
                      className="icon edit-icon" 
                      onClick={() => handleEdit(categoria.id)} 
                    />
                    <FaTrash 
                      className="icon delete-icon" 
                      onClick={() => handleDelete(categoria.id)} 
                    />
                    <button className='button-subcategoria' onClick={() => handleViewSubcategoria(categoria.id)}>Ver Subcategoría</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CategoriaScreen;
