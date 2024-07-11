import React, { useState, useEffect } from 'react';
import Navbar from '../Others/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import '../Producto/ProductoScreen.css'; // Asegúrate de importar tu archivo CSS

const SubcategoriaScreen = () => {
  const [subcategorias, setSubcategorias] = useState([]);
  const [categoriaDescripcion, setCategoriaDescripcion] = useState('');
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Este es el token " + token);

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
      <div className="container">
        <h1 className="title">Subcategorías de {categoriaDescripcion}</h1>
        <button onClick={handleBack} className="button-back">Volver</button>
        {subcategorias.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className="th">#ID Subcategoría</th>
                  <th className="th">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {subcategorias.map((subcategoria) => (
                  <tr key={subcategoria.idSubCategoria}>
                    <td className="td">{subcategoria.idSubCategoria}</td>
                    <td className="td">{subcategoria.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Cargando subcategorías...</p>
        )}
      </div>
    </>
  );
};

export default SubcategoriaScreen;
