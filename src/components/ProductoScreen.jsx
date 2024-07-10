import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import './ProductoScreen.css'; // Asegúrate de importar tu archivo CSS
import { FaEdit, FaTrash } from 'react-icons/fa';


const ProductoScreen = () => {
  const [productos, setProductos] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Este es el token " + token);

    const fetchProductos = async () => {
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      try {
        const response = await fetch('http://vps-1915951-x.dattaweb.com:8090/api/v1/producto', {
          method: 'GET',
          headers: {
            // 'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    };

    fetchProductos();
  }, [token]);

  const handleCreateProduct = () => {
    navigate('/nuevoproductos');
  };

  const handleEdit = (id) => {
    navigate(`/editarproducto/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://vps-1915951-x.dattaweb.com:8090/api/v1/producto/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }
      setProductos(productos.filter(producto => producto.id !== id));
    } catch (error) {
      console.error('Error deleting producto:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">Productos</h1>
        <button className="button" onClick={handleCreateProduct}>Crear Producto</button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="th">#ID de producto</th>
              <th className="th">Código</th>
              <th className="th">Código Original</th>
              <th className="th">Descripción</th>
              <th className="th">Punto de Reposición</th>
              <th className="th">Estado</th>
              <th className="th">Costo</th>
              {/* <th className="th">Precio Venta</th>
              <th className="th">Unidad Compra</th>
              <th className="th">Unidad Venta</th> */}
              {/* <th className="th">Art Dto Gan</th>
              <th className="th">Categoría</th>
              <th className="th">SubCategoría</th>
              <th className="th">Proveedor</th>
              <th className="th">Fecha Modificación</th> */}
              <th className="th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td className="td">{producto.id}</td>
                <td className="td">{producto.codigo}</td>
                <td className="td">{producto.codigoOrig}</td>
                <td className="td">{producto.descripcion}</td>
                <td className="td">{producto.puntoReposicion}</td>
                <td className="td">{producto.estado}</td>
                <td className="td">{producto.costo}</td>
                {/* <td className="td">{producto.precioVenta}</td>
                <td className="td">{producto.unidadCompra}</td>
                <td className="td">{producto.unidadVenta}</td> */}
                {/* <td className="td">{producto.artDtoGan}</td>
                <td className="td">{producto.categoria}</td>
                <td className="td">{producto.subCategoria}</td>
                <td className="td">{producto.proveedor}</td>
                <td className="td">{producto.fechaModificacion}</td> */}
                <td className="td">
                  <FaEdit 
                    className="icon edit-icon" 
                    onClick={() => handleEdit(producto.id)} 
                  />
                  <FaTrash 
                    className="icon delete-icon" 
                    onClick={() => handleDelete(producto.id)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </>
  );
};

export default ProductoScreen;
