import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useNavigate } from 'react-router-dom';
import '../Producto/ProductoScreen.css'; // Asegúrate de importar tu archivo CSS
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const CategoriaScreen = () => {
  const [categorias, setCategorias] = useState([]);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/categoria/paginacion?page=${currentPage}&size=5`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener las categorías');
        }
        const data = await response.json();
        setCategorias(data.content);
        setFilteredCategorias(data.content); // Inicializar categorías filtradas
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };

    fetchCategorias();
  }, [token, currentPage]);

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
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al eliminar la categoría');
      }
      setCategorias(categorias.filter(categoria => categoria.id !== id));
      setFilteredCategorias(filteredCategorias.filter(categoria => categoria.id !== id)); // Actualizar categorías filtradas
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

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">Categorías</h1>
        <button className="button" onClick={handleCreateCategoria}>Crear Categoría</button>

        <div className="search-container">
        <input
          type="text"
          placeholder="Buscar categoría"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>Buscar</button>
      </div>
      </div>



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
            {filteredCategorias.map((categoria) => (
              <tr key={categoria.id}>
                <td className="td">{categoria.id}</td>
                <td className="td">{categoria.descripcion}</td>
                <td className="td">
                  <FaEye
                    className="icon view-icon"
                    onClick={() => handleViewSubcategoria(categoria.id)}
                  />
                  <FaEdit
                    className="icon edit-icon"
                    onClick={() => handleEdit(categoria.id)}
                  />
                  <FaTrash
                    className="icon delete-icon"
                    onClick={() => handleDelete(categoria.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-info">
        <span className='numpag'>Página {currentPage + 1} de {totalPages}</span>
      </div>

      <div className="pagination">
        <div className="pagination-buttons">
          <button className="button" id="bt" onClick={handlePreviousPage} disabled={currentPage === 0}>
            Página Anterior
          </button>
          <button className="button" id="bt" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Página Siguiente
          </button>
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

    </>
  );
};

export default CategoriaScreen;
